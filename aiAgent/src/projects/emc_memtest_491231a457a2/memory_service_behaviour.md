# How Memory Service Should Work

| Scenario                                                      | Action                  | Expected Result                                                                  |
| ------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| **New context**                                               | → `CREATE`              | Create a new memory                                                              |
| **Same context + new useful content**                         | → `UPDATE/MERGE`        | Update the existing memory with the additional information                       |
| **Same context + exact duplicate**                            | → `REINFORCE`           | Keep the existing content and increase confidence                                |
| **Same context + semantically equivalent content**            | → `REINFORCE`           | Keep the existing content and increase confidence                                |
| **Same context + confidence < 0.35**                          | → `DELETE`              | Remove the existing memory                                                       |
| **Same context + lower confidence but ≥ 0.35**                | → `DECAY`               | Reduce the existing memory confidence                                            |
| **Same context + higher confidence**                          | → `UPDATE` confidence   | Keep the memory content and update its confidence                                |
| **Same context + additional information + higher confidence** | → `UPDATE/MERGE`        | Merge the new information and update confidence                                  |
| **Contradictory + similar confidence**                        | → `MERGE`               | Merge both pieces of information and reduce confidence                           |
| **Contradictory + significantly higher confidence**           | → `OVERRIDE`            | Replace the weaker memory with the higher-confidence information                 |
| **Contradictory + lower confidence**                          | → `DECAY`               | Reduce confidence of the existing memory rather than replacing it                |
| **Unrelated context**                                         | → `CREATE`              | Create a separate memory                                                         |
| **No meaningful new information**                             | → `NO_OP` / `REINFORCE` | Do not modify memory content; reinforce only if the existing memory is confirmed |
| **Existing memory is definitively invalid/obsolete**          | → `DELETE`              | Permanently remove the memory                                                    |
| **Multiple overlapping memories**                             | → `UPDATE/MERGE`        | Consolidate relevant information instead of creating duplicates                  |
| **Tool/database failure**                                     | → `ERROR`               | Do not report success; propagate the failure for retry/handling                  |

## Core Decision Rules

1. **Prefer updating an existing relevant memory over creating a duplicate.**
2. **Exact or semantically equivalent information should reinforce the existing memory rather than create another memory.**
3. **Additional useful information should be merged into the existing memory.**
4. **Contradictions should be resolved using confidence.**
5. **A significantly stronger contradictory memory should override the weaker memory.**
6. **Similar-confidence contradictions should be merged with reduced confidence.**
7. **Low-confidence information should weaken the relevant existing memory; when confidence reaches the deletion threshold according to the configured rule, remove it.**
8. **Unrelated information should create a separate memory.**
9. **Memory content should not be changed when the new information only confirms the existing memory.**
10. **Only one final memory operation should be performed for a single memory decision.**
11. **After a successful memory operation, the Memory Agent should stop and return the operation result.**
12. **`memoryType` must be preserved correctly as `semantic`, `episodic`, or `behavioral`.**

## Operation Semantics

### `CREATE`

Used when no existing memory adequately represents the new information.

### `UPDATE`

Used when an existing memory is relevant but its content needs to be corrected, extended, or replaced.

### `REINFORCE`

Used when new information confirms an existing memory without requiring a content change.

### `DECAY`

Used when evidence weakens an existing memory but does not justify immediate deletion.

### `DELETE`

Used when a memory is definitively invalid, obsolete, or falls below the configured confidence threshold.

### `NO_OP`

Used when there is no meaningful change to make and the new information does not provide sufficient evidence to modify or reinforce an existing memory.

## Priority

When multiple conditions appear to apply, use this decision priority:

**UPDATE/MERGE → REINFORCE → DECAY → DELETE → CREATE → NO_OP**

The selected operation must be based on the relationship between the new information and the retrieved existing memories, not on the new input alone.
