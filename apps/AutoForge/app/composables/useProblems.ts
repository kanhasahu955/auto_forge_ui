/**
 * Mock problems data - replace with API later (FastAPI + LangChain)
 */

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Problem = {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  acceptanceRate: number
  tags: string[]
  description: string
  sampleInput: string
  sampleOutput: string
  templateCode: Record<string, string>
  constraints: string[]
  /** 1-based level; must complete previous level to unlock */
  level: number
}

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    level: 1,
    slug: 'two-sum',
    difficulty: 'easy',
    acceptanceRate: 47,
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    templateCode: {
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
      go: `func twoSum(nums []int, target int) []int {
	// Your code here
	
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your code here

}`,
    },
    constraints: ['2 <= nums.length <= 10⁴', '-10⁹ <= nums[i] <= 10⁹', 'Only one valid answer exists.'],
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    level: 2,
    slug: 'valid-parentheses',
    difficulty: 'easy',
    acceptanceRate: 40,
    tags: ['String', 'Stack'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.`,
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    templateCode: {
      python: `def is_valid(s: str) -> bool:
    # Your code here
    pass`,
      javascript: `function isValid(s) {
    // Your code here
    
}`,
      go: `func isValid(s string) bool {
	// Your code here
	
}`,
      typescript: `function isValid(s: string): boolean {
  // Your code here

}`,
    },
    constraints: ['1 <= s.length <= 10⁴', 's consists of parentheses only \'()[]{}\'.'],
  },
  {
    id: '3',
    title: 'Merge Two Sorted Lists',
    level: 3,
    slug: 'merge-two-sorted-lists',
    difficulty: 'easy',
    acceptanceRate: 55,
    tags: ['Linked List', 'Recursion'],
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    sampleInput: 'list1 = [1,2,4], list2 = [1,3,4]',
    sampleOutput: '[1,1,2,3,4,4]',
    templateCode: {
      python: `def merge_two_lists(list1, list2):
    # Your code here
    pass`,
      javascript: `function mergeTwoLists(list1, list2) {
    // Your code here
    
}`,
      go: `func mergeTwoLists(list1, list2 []int) []int {
	// Your code here
	
}`,
      typescript: `function mergeTwoLists(list1: number[], list2: number[]): number[] {
  // Your code here

}`,
    },
    constraints: ['0 <= size of both lists <= 50', '-100 <= Node.val <= 100'],
  },
  {
    id: '4',
    title: 'Longest Substring Without Repeating Characters',
    level: 4,
    slug: 'longest-substring-without-repeating',
    difficulty: 'medium',
    acceptanceRate: 31,
    tags: ['String', 'Sliding Window'],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    templateCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    # Your code here
    pass`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Your code here
    
}`,
      go: `func lengthOfLongestSubstring(s string) int {
	// Your code here
	
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Your code here

}`,
    },
    constraints: ['0 <= s.length <= 5 * 10⁴', 's consists of English letters, digits, symbols.'],
  },
  {
    id: '5',
    title: 'Trapping Rain Water',
    level: 5,
    slug: 'trapping-rain-water',
    difficulty: 'hard',
    acceptanceRate: 54,
    tags: ['Array', 'Two Pointers', 'Stack'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    sampleOutput: '6',
    templateCode: {
      python: `def trap(height: list[int]) -> int:
    # Your code here
    pass`,
      javascript: `function trap(height) {
    // Your code here
    
}`,
      go: `func trap(height []int) int {
	// Your code here
	
}`,
      typescript: `function trap(height: number[]): number {
  // Your code here

}`,
    },
    constraints: ['n == height.length', '0 <= height[i] <= 10⁵'],
  },
]

export function useProblems() {
  const getProblemBySlug = (slug: string) =>
    MOCK_PROBLEMS.find((p) => p.slug === slug) ?? null

  const getProblemById = (id: string) =>
    MOCK_PROBLEMS.find((p) => p.id === id) ?? null

  const getProblemsByDifficulty = (difficulty: Difficulty) =>
    MOCK_PROBLEMS.filter((p) => p.difficulty === difficulty)

  const getProblemsByTag = (tag: string) =>
    MOCK_PROBLEMS.filter((p) => p.tags.includes(tag))

  return {
    problems: MOCK_PROBLEMS,
    getProblemBySlug,
    getProblemById,
    getProblemsByDifficulty,
    getProblemsByTag,
  }
}
