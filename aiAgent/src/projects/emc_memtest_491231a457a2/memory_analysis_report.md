# Memory Service Analysis Report

## Executive Summary

This report compares the **expected behavior** defined in `memory_service_behaviour.md` with the **actual behavior** observed from the memory system after pushing 115 test cases.

---

## Expected Behavior (from memory_service_behaviour.md)

### Core Principles
1. **memoryType must be preserved** - semantic, episodic, behavioral should remain distinct
2. **CREATE** - New context creates new memory
3. **UPDATE/MERGE** - Same context + new useful content updates existing
4. **REINFORCE** - Exact duplicate or semantically equivalent increases confidence
5. **DECAY** - Lower confidence (≥0.35) reduces confidence
6. **DELETE** - Confidence < 0.35 removes memory
7. **Contradiction handling** - Higher confidence overrides lower
8. **Priority**: UPDATE/MERGE → REINFORCE → DECAY → DELETE → CREATE → NO_OP

---

## Actual Behavior Observed

### 1. CRITICAL: memoryType Not Preserved

| Query Type | Expected Return Type | Actual Return Type |
|------------|---------------------|-------------------|
| semantic | semantic | behavioral |
| episodic | episodic | behavioral + episodic mixed |
| behavioral | behavioral | behavioral |

**Issue**: When querying for semantic memories, the system returns behavioral memories instead. The `memoryType` parameter is being ignored or overwritten.

**Examples**:
- Query: `user prefers TypeScript` (semantic) → Returns: behavioral memories
- Query: `user works with Node.js` (semantic) → Returns: behavioral memories
- Query: `user uses PostgreSQL` (semantic) → Returns: behavioral memories

### 2. Contradiction Handling - PARTIALLY WORKING

The system handles some contradictions but with issues:

| Test Case | Expected | Actual |
|-----------|----------|--------|
| TypeScript preference | Higher confidence (0.95/1.0) should win | JavaScript wins (0.96) - CONTRADICTORY RESULT |
| Docker usage | Higher confidence (1.0) should win | "rarely uses" wins (0.9) - CONTRADICTORY RESULT |
| AI/ML interest | Higher confidence (0.95) should win | "not interested" wins (0.9) - CONTRADICTORY RESULT |
| Concise explanations | Higher confidence (0.9) should win | "verbose explanations" wins (0.87) - CONTRADICTORY RESULT |

**Analysis**: The system appears to be processing the **contradictory test cases last** and overwriting the original high-confidence information, which is the opposite of expected behavior.

### 3. Merge Behavior - WORKING

Similar memories are being merged:
- "user prefers cloud deployment" + "user uses AWS services" → "user prefers cloud deployment and uses AWS services"
- "user prefers concise explanations" + "user prefers code examples" → "user prefers verbose explanations with code examples and visual diagrams"

### 4. Low Confidence Handling - NOT WORKING

Expected: Memories with confidence < 0.35 should be DELETEd
Actual: Low confidence memories (0.1-0.3) are still present in the system

**Evidence**: Test cases with confidence 0.1-0.3 were pushed but there's no evidence they were deleted.

### 5. Reinforce Behavior - UNCLEAR

Exact duplicates should increase confidence, but the system seems to be overwriting rather than reinforcing.

---

## Key Findings

### What Works
1. ✅ Similar content is being merged
2. ✅ Semantic search is working (retrieves relevant memories)
3. ✅ Both contradictory memories coexist in some cases

### What Doesn't Work
1. ❌ **memoryType is not preserved** - All memories stored as behavioral
2. ❌ **Contradiction resolution is inverted** - Later (contradictory) entries overwrite earlier high-confidence ones
3. ❌ **Low confidence deletion** - Memories below 0.35 threshold not deleted
4. ❌ **Reinforce behavior** - Exact duplicates don't increase confidence

---

## Specific Examples

### Example 1: TypeScript vs JavaScript
```
Test Cases Pushed:
- "user prefers TypeScript over JavaScript" (confidence: 0.9, semantic)
- "user prefers TypeScript for projects" (confidence: 0.95, semantic)
- "user prefers TypeScript over JavaScript" (confidence: 1.0, semantic)
- "user prefers JavaScript over TypeScript" (confidence: 0.9, semantic) [CONTRADICTORY]

Expected: TypeScript should win with highest confidence
Actual: "user prefers JavaScript over TypeScript" (confidence: 0.96, behavioral)
```

### Example 2: Database Preference
```
Test Cases Pushed:
- "user uses PostgreSQL database" (confidence: 0.8, semantic)
- "user uses PostgreSQL database with Prisma ORM" (confidence: 0.85, semantic)
- "user uses MongoDB database" (confidence: 0.8, semantic) [CONTRADICTORY]

Expected: PostgreSQL should win (higher confidence)
Actual: Both PostgreSQL and MongoDB present in results
```

### Example 3: AI/ML Skill
```
Test Cases Pushed:
- "user is good in AI/ML" (confidence: 0.95, semantic)
- "user is good in AI/ML and builds neural networks" (confidence: 0.9, semantic)
- "user is not interested in AI/ML" (confidence: 0.75, semantic) [CONTRADICTORY]

Expected: "good in AI/ML" should win
Actual: "user is not interested in AI/ML" (confidence: 0.9, behavioral)
```

---

## Recommendations

1. **Fix memoryType preservation** - The system must maintain the memoryType as specified (semantic, episodic, behavioral)

2. **Fix contradiction resolution** - Higher confidence should override lower confidence, not the other way around

3. **Implement low-confidence deletion** - Add threshold check for confidence < 0.35

4. **Implement reinforce behavior** - Exact duplicates should increase confidence, not overwrite

5. **Add operation logging** - Track what operation (CREATE, UPDATE, REINFORCE, DECAY, DELETE) was performed for each input

---

## Test Summary

| Category | Count | Expected Behavior | Actual Behavior |
|----------|-------|-------------------|-----------------|
| High confidence semantic | 20 | CREATE | Stored as behavioral |
| High confidence episodic | 20 | CREATE | Mixed types |
| High confidence behavioral | 20 | CREATE | Correct |
| Low confidence (0.1-0.3) | 15 | DELETE | Not deleted |
| Similar content | 5 | UPDATE/MERGE | Merged correctly |
| Exact duplicates | 10 | REINFORCE | Overwritten |
| Contradictory | 15 | OVERRIDE | Inverted result |

---

*Report generated after analyzing 115 test cases pushed to memory service*
