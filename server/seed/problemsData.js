const problemsData = [
  // 1. ARRAYS - Two Sum (Easy)
  {
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    inputFormat: 'First line contains integer N (size of array). Second line contains N space-separated integers. Third line contains integer target.',
    outputFormat: 'Print the two space-separated indices (0-indexed) in ascending order.',
    constraints: '2 <= N <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 9, we return 0 1.',
      },
      {
        input: '3\n3 2 4\n6',
        output: '1 2',
        explanation: 'nums[1] + nums[2] == 6, so we return 1 2.',
      },
    ],
    starterCode: {
      python: `# Read input from standard input (sys.stdin)
import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    target = int(lines[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(f"{seen[complement]} {i}")
            return
        seen[num] = i

if __name__ == '__main__':
    solve()
`,
      javascript: `// Read input from stdin
const fs = require('fs');

function solve() {
  const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (input.length < 3) return;
  
  const n = parseInt(input[0], 10);
  const nums = input.slice(1, n + 1).map(Number);
  const target = parseInt(input[n + 1], 10);

  const seen = new Map();
  for (let i = 0; i < n; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      console.log(\`\${seen.get(complement)} \${i}\`);
      return;
    }
    seen.set(nums[i], i);
  }
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    long long target;
    cin >> target;

    unordered_map<long long, int> seen;
    for (int i = 0; i < n; i++) {
        long long complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            cout << seen[complement] << " " << i << "\n";
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '4\n2 7 11 15\n9',
        expectedOutput: '0 1',
        explanation: 'nums[0] + nums[1] = 9',
      },
      {
        input: '3\n3 2 4\n6',
        expectedOutput: '1 2',
        explanation: 'nums[1] + nums[2] = 6',
      },
    ],
    hiddenTestCases: [
      {
        input: '2\n3 3\n6',
        expectedOutput: '0 1',
      },
      {
        input: '5\n-1 -2 -3 -4 -5\n-8',
        expectedOutput: '2 4',
      },
      {
        input: '6\n1 5 10 20 40 80\n60',
        expectedOutput: '3 4',
      },
    ],
    tags: ['Hash Table', 'Array', 'Two Pointers'],
  },

  // 2. ARRAYS - Best Time to Buy and Sell Stock (Easy)
  {
    title: 'Best Time to Buy and Sell Stock',
    topic: 'Arrays',
    difficulty: 'Easy',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated prices.',
    outputFormat: 'Print the maximum profit integer.',
    constraints: '1 <= N <= 10^5\n0 <= prices[i] <= 10^4',
    examples: [
      {
        input: '6\n7 1 5 3 6 4',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.',
      },
      {
        input: '5\n7 6 4 3 1',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    prices = [int(x) for x in tokens[1:n+1]]
    
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_profit:
            max_profit = p - min_price
            
    print(max_profit)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  const prices = tokens.slice(1, n + 1).map(Number);
  
  let minPrice = Infinity;
  let maxProfit = 0;
  for (let i = 0; i < n; i++) {
    if (prices[i] < minPrice) minPrice = prices[i];
    else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;
  }
  console.log(maxProfit);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    long long min_price = 1e18;
    long long max_profit = 0;
    for (int i = 0; i < n; i++) {
        long long price;
        cin >> price;
        if (price < min_price) min_price = price;
        else if (price - min_price > max_profit) max_profit = price - min_price;
    }
    cout << max_profit << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '6\n7 1 5 3 6 4',
        expectedOutput: '5',
        explanation: 'Buy at 1, sell at 6',
      },
      {
        input: '5\n7 6 4 3 1',
        expectedOutput: '0',
        explanation: 'Prices constantly decline',
      },
    ],
    hiddenTestCases: [
      {
        input: '2\n2 4',
        expectedOutput: '2',
      },
      {
        input: '7\n1 2 3 4 5 6 7',
        expectedOutput: '6',
      },
      {
        input: '1\n100',
        expectedOutput: '0',
      },
    ],
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
  },

  // 3. ARRAYS - Maximum Subarray / Kadane's Algorithm (Medium)
  {
    title: 'Maximum Subarray Sum',
    topic: 'Arrays',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print the maximum subarray sum.',
    constraints: '1 <= N <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.',
      },
      {
        input: '1\n1',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    
    max_so_far = nums[0]
    curr_max = nums[0]
    for i in range(1, n):
        curr_max = max(nums[i], curr_max + nums[i])
        max_so_far = max(max_so_far, curr_max)
        
    print(max_so_far)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  const nums = tokens.slice(1, n + 1).map(Number);
  
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < n; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  console.log(maxSoFar);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    long long num;
    cin >> num;
    long long max_so_far = num;
    long long curr_max = num;
    for (int i = 1; i < n; i++) {
        cin >> num;
        curr_max = max(num, curr_max + num);
        max_so_far = max(max_so_far, curr_max);
    }
    cout << max_so_far << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        expectedOutput: '6',
        explanation: 'Contiguous subarray [4,-1,2,1] has sum 6',
      },
      {
        input: '5\n5 4 -1 7 8',
        expectedOutput: '23',
        explanation: 'Entire array has max sum 23',
      },
    ],
    hiddenTestCases: [
      {
        input: '5\n-1 -2 -3 -4 -5',
        expectedOutput: '-1',
      },
      {
        input: '4\n-2 -1 -3 -4',
        expectedOutput: '-1',
      },
      {
        input: '3\n10 -20 30',
        expectedOutput: '30',
      },
    ],
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming', "Kadane's"],
  },

  // 4. STRINGS - Valid Palindrome (Easy)
  {
    title: 'Valid Palindrome',
    topic: 'Strings',
    difficulty: 'Easy',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: 'A single line containing the string S.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= length(s) <= 2 * 10^5\ns consists only of printable ASCII characters.',
    examples: [
      {
        input: 'A man, a plan, a canal: Panama',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 'race a car',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
    starterCode: {
      python: `import sys
import re

def solve():
    s = sys.stdin.read().strip()
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    if cleaned == cleaned[::-1]:
        print("true")
    else:
        print("false")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const s = fs.readFileSync(0, 'utf-8').trim();
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversed = cleaned.split('').reverse().join('');
  console.log(cleaned === reversed ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    int l = 0, r = (int)s.length() - 1;
    bool is_palindrome = true;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) {
            is_palindrome = false;
            break;
        }
        l++;
        r--;
    }
    cout << (is_palindrome ? "true" : "false") << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: 'A man, a plan, a canal: Panama',
        expectedOutput: 'true',
        explanation: 'Reads amanaplanacanalpanama',
      },
      {
        input: 'race a car',
        expectedOutput: 'false',
        explanation: 'raceacar is not palindrome',
      },
    ],
    hiddenTestCases: [
      {
        input: '0P',
        expectedOutput: 'false',
      },
      {
        input: 'Madam',
        expectedOutput: 'true',
      },
      {
        input: 'Was it a car or a cat I saw?',
        expectedOutput: 'true',
      },
    ],
    tags: ['Two Pointers', 'String'],
  },

  // 5. STRINGS - Longest Substring Without Repeating Characters (Medium)
  {
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    difficulty: 'Medium',
    description: `Given a string \`s\`, find the length of the longest substring without duplicate characters.`,
    inputFormat: 'A single line containing string S.',
    outputFormat: 'Print an integer denoting the length of the longest substring without repeating characters.',
    constraints: '0 <= length(s) <= 5 * 10^4',
    examples: [
      {
        input: 'abcabcbb',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 'bbbbb',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    line = sys.stdin.readline().rstrip('\\r\\n')
    char_map = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(line):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)
    print(max_len)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const input = fs.readFileSync(0, 'utf-8').replace(/[\\r\\n]/g, '');
  const charMap = new Map();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < input.length; right++) {
    const ch = input[right];
    if (charMap.has(ch) && charMap.get(ch) >= left) {
      left = charMap.get(ch) + 1;
    }
    charMap.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  console.log(maxLen);
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    unordered_map<char, int> char_map;
    int left = 0, max_len = 0;
    for (int right = 0; right < (int)s.length(); right++) {
        if (char_map.find(s[right]) != char_map.end() && char_map[s[right]] >= left) {
            left = char_map[s[right]] + 1;
        }
        char_map[s[right]] = right;
        max_len = max(max_len, right - left + 1);
    }
    cout << max_len << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: 'abcabcbb',
        expectedOutput: '3',
        explanation: 'abc is length 3',
      },
      {
        input: 'pwwkew',
        expectedOutput: '3',
        explanation: 'wke is length 3',
      },
    ],
    hiddenTestCases: [
      {
        input: 'geeksforgeeks',
        expectedOutput: '7',
      },
      {
        input: 'aab',
        expectedOutput: '2',
      },
      {
        input: 'dvdf',
        expectedOutput: '3',
      },
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
  },

  // 6. LINKED LISTS - Reverse Linked List (Easy)
  {
    title: 'Reverse Linked List',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    description: `Given the head of a singly linked list represented as an array of values, reverse the list, and return the reversed list.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated values.',
    outputFormat: 'Print the reversed list as N space-separated integers.',
    constraints: '0 <= N <= 5000\n-5000 <= Node.val <= 5000',
    examples: [
      {
        input: '5\n1 2 3 4 5',
        output: '5 4 3 2 1',
        explanation: 'Reversing 1->2->3->4->5 yields 5->4->3->2->1.',
      },
      {
        input: '2\n1 2',
        output: '2 1',
        explanation: 'Reversing 1->2 yields 2->1.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    vals = tokens[1:n+1]
    print(' '.join(reversed(vals)))

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  const vals = tokens.slice(1, n + 1);
  console.log(vals.reverse().join(' '));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    for (int i = n - 1; i >= 0; i--) {
        cout << v[i] << (i == 0 ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '5 4 3 2 1',
        explanation: 'Reversed 1 2 3 4 5',
      },
      {
        input: '2\n1 2',
        expectedOutput: '2 1',
        explanation: 'Reversed 1 2',
      },
    ],
    hiddenTestCases: [
      {
        input: '1\n42',
        expectedOutput: '42',
      },
      {
        input: '4\n10 20 30 40',
        expectedOutput: '40 30 20 10',
      },
    ],
    tags: ['Linked List', 'Recursion'],
  },

  // 7. LINKED LISTS - Merge Two Sorted Lists (Easy)
  {
    title: 'Merge Two Sorted Lists',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the merged sorted list.`,
    inputFormat: 'First line contains N and M. Second line contains N sorted integers. Third line contains M sorted integers.',
    outputFormat: 'Print the N + M sorted integers separated by a single space.',
    constraints: '0 <= N, M <= 50\n-100 <= Node.val <= 100',
    examples: [
      {
        input: '3 3\n1 2 4\n1 3 4',
        output: '1 1 2 3 4 4',
        explanation: 'Merged sorted sequence.',
      },
      {
        input: '0 1\n\n0',
        output: '0',
        explanation: 'Merging empty list with [0].',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n, m = int(tokens[0]), int(tokens[1])
    l1 = [int(x) for x in tokens[2:2+n]]
    l2 = [int(x) for x in tokens[2+n:2+n+m]]
    merged = sorted(l1 + l2)
    print(' '.join(map(str, merged)))

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const m = parseInt(tokens[1], 10);
  const l1 = tokens.slice(2, 2 + n).map(Number);
  const l2 = tokens.slice(2 + n, 2 + n + m).map(Number);
  const merged = l1.concat(l2).sort((a, b) => a - b);
  console.log(merged.join(' '));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> res(n + m);
    for (int i = 0; i < n + m; i++) cin >> res[i];
    sort(res.begin(), res.end());
    for (int i = 0; i < (int)res.size(); i++) {
        cout << res[i] << (i + 1 == (int)res.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '3 3\n1 2 4\n1 3 4',
        expectedOutput: '1 1 2 3 4 4',
        explanation: 'Combined sorted lists',
      },
    ],
    hiddenTestCases: [
      {
        input: '1 2\n5\n2 8',
        expectedOutput: '2 5 8',
      },
      {
        input: '3 2\n-10 -5 0\n-7 2',
        expectedOutput: '-10 -7 -5 0 2',
      },
    ],
    tags: ['Linked List', 'Recursion', 'Two Pointers'],
  },

  // 8. STACK - Valid Parentheses (Easy)
  {
    title: 'Valid Parentheses',
    topic: 'Stack',
    difficulty: 'Easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'A single string S containing brackets.',
    outputFormat: 'Print "true" if valid, else "false".',
    constraints: '1 <= length(s) <= 10^4',
    examples: [
      {
        input: '()[]{}',
        output: 'true',
        explanation: 'All brackets match correctly.',
      },
      {
        input: '(]',
        output: 'false',
        explanation: 'Mismatched brackets.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                print("false")
                return
            stack.pop()
        else:
            stack.append(ch)
    print("true" if len(stack) == 0 else "false")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const s = fs.readFileSync(0, 'utf-8').trim();
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (pairs[ch]) {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[ch]) {
        console.log("false");
        return;
      }
      stack.pop();
    } else {
      stack.push(ch);
    }
  }
  console.log(stack.length === 0 ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) return 0;
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) { cout << "false\\n"; return 0; }
            if (c == ')' && st.top() != '(') { cout << "false\\n"; return 0; }
            if (c == '}' && st.top() != '{') { cout << "false\\n"; return 0; }
            if (c == ']' && st.top() != '[') { cout << "false\\n"; return 0; }
            st.pop();
        }
    }
    cout << (st.empty() ? "true" : "false") << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '()[]{}',
        expectedOutput: 'true',
        explanation: 'Valid parentheses',
      },
      {
        input: '(]',
        expectedOutput: 'false',
        explanation: 'Invalid match',
      },
    ],
    hiddenTestCases: [
      {
        input: '([{}])',
        expectedOutput: 'true',
      },
      {
        input: '((',
        expectedOutput: 'false',
      },
      {
        input: ']',
        expectedOutput: 'false',
      },
    ],
    tags: ['Stack', 'String'],
  },

  // 9. STACK - Min Stack (Medium)
  {
    title: 'Min Stack Operations',
    topic: 'Stack',
    difficulty: 'Medium',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

You are given Q operations:
- \`push x\`: Push element x onto stack.
- \`pop\`: Removes the element on top of the stack.
- \`top\`: Print top element.
- \`getMin\`: Print the minimum element in the stack.`,
    inputFormat: 'First line contains Q (number of operations). Next Q lines each contain an operation.',
    outputFormat: 'Print the output of each "top" and "getMin" operation on a new line.',
    constraints: '1 <= Q <= 3 * 10^4\n-2^31 <= val <= 2^31 - 1',
    examples: [
      {
        input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ngetMin',
        output: '-3\n-2',
        explanation: 'min element after pushing -2, 0, -3 is -3. After pop, min is -2.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    q = int(lines[0])
    stack = []
    min_stack = []
    
    for i in range(1, q + 1):
        if not lines[i].strip():
            continue
        parts = lines[i].split()
        op = parts[0]
        if op == 'push':
            val = int(parts[1])
            stack.append(val)
            if not min_stack or val <= min_stack[-1]:
                min_stack.append(val)
        elif op == 'pop':
            if stack:
                popped = stack.pop()
                if min_stack and popped == min_stack[-1]:
                    min_stack.pop()
        elif op == 'top':
            if stack:
                print(stack[-1])
        elif op == 'getMin':
            if min_stack:
                print(min_stack[-1])

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);
  if (!lines || lines.length === 0) return;
  const q = parseInt(lines[0], 10);
  const stack = [];
  const minStack = [];

  for (let i = 1; i <= q; i++) {
    if (!lines[i]) continue;
    const parts = lines[i].trim().split(/\\s+/);
    const op = parts[0];
    if (op === 'push') {
      const val = parseInt(parts[1], 10);
      stack.push(val);
      if (minStack.length === 0 || val <= minStack[minStack.length - 1]) {
        minStack.push(val);
      }
    } else if (op === 'pop') {
      const val = stack.pop();
      if (minStack.length > 0 && val === minStack[minStack.length - 1]) {
        minStack.pop();
      }
    } else if (op === 'top') {
      console.log(stack[stack.length - 1]);
    } else if (op === 'getMin') {
      console.log(minStack[minStack.length - 1]);
    }
  }
}

solve();
`,
      cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int q;
    if (!(cin >> q)) return 0;
    stack<long long> s, min_s;
    while (q--) {
        string op;
        cin >> op;
        if (op == "push") {
            long long val;
            cin >> val;
            s.push(val);
            if (min_s.empty() || val <= min_s.top()) min_s.push(val);
        } else if (op == "pop") {
            if (!s.empty()) {
                if (s.top() == min_s.top()) min_s.pop();
                s.pop();
            }
        } else if (op == "top") {
            if (!s.empty()) cout << s.top() << "\\n";
        } else if (op == "getMin") {
            if (!min_s.empty()) cout << min_s.top() << "\\n";
        }
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '6\npush -2\npush 0\npush -3\ngetMin\npop\ngetMin',
        expectedOutput: '-3\n-2',
        explanation: 'Valid min stack ops',
      },
    ],
    hiddenTestCases: [
      {
        input: '5\npush 10\npush 20\ntop\ngetMin\npop',
        expectedOutput: '20\n10',
      },
      {
        input: '4\npush 5\npush 5\ngetMin\npop',
        expectedOutput: '5',
      },
    ],
    tags: ['Stack', 'Design'],
  },

  // 10. QUEUE - Implement Queue using Stacks (Easy)
  {
    title: 'Queue Using Stacks',
    topic: 'Queue',
    difficulty: 'Easy',
    description: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (\`push\`, \`peek\`, \`pop\`, and \`empty\`).`,
    inputFormat: 'First line contains integer Q. Next Q lines each contain an operation ("push x", "pop", "peek", "empty").',
    outputFormat: 'Print the output of each "peek", "pop", and "empty" operation on a new line.',
    constraints: '1 <= Q <= 100',
    examples: [
      {
        input: '5\npush 1\npush 2\npeek\npop\nempty',
        output: '1\n1\nfalse',
        explanation: 'Queue operations simulate FIFO.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    q = int(lines[0])
    in_stack = []
    out_stack = []
    
    for i in range(1, q + 1):
        if not lines[i].strip():
            continue
        parts = lines[i].split()
        op = parts[0]
        if op == 'push':
            in_stack.append(int(parts[1]))
        else:
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            if op == 'pop':
                print(out_stack.pop())
            elif op == 'peek':
                print(out_stack[-1])
            elif op == 'empty':
                print("true" if not in_stack and not out_stack else "false")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const lines = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);
  if (!lines || lines.length === 0) return;
  const q = parseInt(lines[0], 10);
  const inStack = [];
  const outStack = [];

  for (let i = 1; i <= q; i++) {
    if (!lines[i]) continue;
    const parts = lines[i].trim().split(/\\s+/);
    const op = parts[0];
    if (op === 'push') {
      inStack.push(parseInt(parts[1], 10));
    } else {
      if (outStack.length === 0) {
        while (inStack.length > 0) outStack.push(inStack.pop());
      }
      if (op === 'pop') {
        console.log(outStack.pop());
      } else if (op === 'peek') {
        console.log(outStack[outStack.length - 1]);
      } else if (op === 'empty') {
        console.log(inStack.length === 0 && outStack.length === 0 ? "true" : "false");
      }
    }
  }
}

solve();
`,
      cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int q;
    if (!(cin >> q)) return 0;
    stack<int> in_s, out_s;
    while (q--) {
        string op;
        cin >> op;
        if (op == "push") {
            int x; cin >> x;
            in_s.push(x);
        } else {
            if (out_s.empty()) {
                while (!in_s.empty()) {
                    out_s.push(in_s.top());
                    in_s.pop();
                }
            }
            if (op == "pop") {
                cout << out_s.top() << "\\n";
                out_s.pop();
            } else if (op == "peek") {
                cout << out_s.top() << "\\n";
            } else if (op == "empty") {
                cout << (in_s.empty() && out_s.empty() ? "true" : "false") << "\\n";
            }
        }
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '5\npush 1\npush 2\npeek\npop\nempty',
        expectedOutput: '1\n1\nfalse',
        explanation: 'FIFO behavior',
      },
    ],
    hiddenTestCases: [
      {
        input: '3\npush 100\npeek\nempty',
        expectedOutput: '100\nfalse',
      },
      {
        input: '4\npush 7\npop\nempty',
        expectedOutput: '7\ntrue',
      },
    ],
    tags: ['Stack', 'Queue', 'Design'],
  },

  // 11. SEARCHING - Binary Search (Easy)
  {
    title: 'Binary Search',
    topic: 'Searching',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index (0-indexed). Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: 'First line contains integer N. Second line contains N sorted space-separated integers. Third line contains target integer.',
    outputFormat: 'Print the index of target or -1.',
    constraints: '1 <= N <= 10^5\n-10^4 < nums[i], target < 10^4\nAll integers in nums are unique and sorted in ascending order.',
    examples: [
      {
        input: '6\n-1 0 3 5 9 12\n9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.',
      },
      {
        input: '6\n-1 0 3 5 9 12\n2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    target = int(tokens[n+1])
    
    l, r = 0, n - 1
    ans = -1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            ans = mid
            break
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    print(ans)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 3) return;
  const n = parseInt(tokens[0], 10);
  const nums = tokens.slice(1, n + 1).map(Number);
  const target = parseInt(tokens[n + 1], 10);

  let l = 0, r = n - 1;
  let ans = -1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) {
      ans = mid;
      break;
    } else if (nums[mid] < target) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }
  console.log(ans);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) { ans = mid; break; }
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    cout << ans << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '6\n-1 0 3 5 9 12\n9',
        expectedOutput: '4',
        explanation: 'Index of 9 is 4',
      },
      {
        input: '6\n-1 0 3 5 9 12\n2',
        expectedOutput: '-1',
        explanation: '2 not present',
      },
    ],
    hiddenTestCases: [
      {
        input: '1\n5\n5',
        expectedOutput: '0',
      },
      {
        input: '2\n2 5\n2',
        expectedOutput: '0',
      },
      {
        input: '5\n1 3 5 7 9\n8',
        expectedOutput: '-1',
      },
    ],
    tags: ['Array', 'Binary Search'],
  },

  // 12. SEARCHING - Search in Rotated Sorted Array (Medium)
  {
    title: 'Search in Rotated Sorted Array',
    topic: 'Searching',
    difficulty: 'Medium',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (\`1 <= k < nums.length\`).

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must achieve \`O(log n)\` runtime complexity.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers. Third line contains integer target.',
    outputFormat: 'Print the index of target or -1.',
    constraints: '1 <= N <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.',
    examples: [
      {
        input: '7\n4 5 6 7 0 1 2\n0',
        output: '4',
        explanation: '0 is at index 4.',
      },
      {
        input: '7\n4 5 6 7 0 1 2\n3',
        output: '-1',
        explanation: '3 is not in array.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    target = int(tokens[n+1])
    
    l, r = 0, n - 1
    ans = -1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            ans = mid
            break
        # Left half sorted
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        # Right half sorted
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    print(ans)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 3) return;
  const n = parseInt(tokens[0], 10);
  const nums = tokens.slice(1, n + 1).map(Number);
  const target = parseInt(tokens[n + 1], 10);

  let l = 0, r = n - 1, ans = -1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) { ans = mid; break; }
    if (nums[l] <= nums[mid]) {
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  console.log(ans);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target; cin >> target;

    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) { ans = mid; break; }
        if (nums[l] <= nums[mid]) {
            if (nums[l] <= target && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    cout << ans << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '7\n4 5 6 7 0 1 2\n0',
        expectedOutput: '4',
        explanation: '0 found at index 4',
      },
      {
        input: '7\n4 5 6 7 0 1 2\n3',
        expectedOutput: '-1',
        explanation: '3 is not found',
      },
    ],
    hiddenTestCases: [
      {
        input: '1\n1\n0',
        expectedOutput: '-1',
      },
      {
        input: '3\n3 1 2\n1',
        expectedOutput: '1',
      },
      {
        input: '5\n5 1 2 3 4\n1',
        expectedOutput: '1',
      },
    ],
    tags: ['Array', 'Binary Search'],
  },

  // 13. SORTING - Merge Intervals (Medium)
  {
    title: 'Merge Intervals',
    topic: 'Sorting',
    difficulty: 'Medium',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    inputFormat: 'First line contains integer N (number of intervals). Next N lines each contain two space-separated integers start and end.',
    outputFormat: 'Print merged intervals each on a new line in ascending order of start time.',
    constraints: '1 <= N <= 10^4\n0 <= start_i <= end_i <= 10^4',
    examples: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        output: '1 6\n8 10\n15 18',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    intervals = []
    idx = 1
    for _ in range(n):
        intervals.append([int(tokens[idx]), int(tokens[idx+1])])
        idx += 2
        
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    for m in merged:
        print(f"{m[0]} {m[1]}")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  const intervals = [];
  let idx = 1;
  for (let i = 0; i < n; i++) {
    intervals.push([parseInt(tokens[idx], 10), parseInt(tokens[idx + 1], 10)]);
    idx += 2;
  }
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of intervals) {
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  for (const m of merged) {
    console.log(\`\${m[0]} \${m[1]}\`);
  }
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<pair<int, int>> intervals(n);
    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;
    sort(intervals.begin(), intervals.end());

    vector<pair<int, int>> merged;
    for (auto& iv : intervals) {
        if (merged.empty() || merged.back().second < iv.first) {
            merged.push_back(iv);
        } else {
            merged.back().second = max(merged.back().second, iv.second);
        }
    }
    for (auto& m : merged) {
        cout << m.first << " " << m.second << "\\n";
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        expectedOutput: '1 6\n8 10\n15 18',
        explanation: 'Overlapping intervals merged',
      },
    ],
    hiddenTestCases: [
      {
        input: '2\n1 4\n4 5',
        expectedOutput: '1 5',
      },
      {
        input: '3\n1 4\n0 4\n3 5',
        expectedOutput: '0 5',
      },
    ],
    tags: ['Array', 'Sorting'],
  },

  // 14. SORTING - Kth Largest Element in an Array (Medium)
  {
    title: 'Kth Largest Element',
    topic: 'Sorting',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`-th largest element in the array.

Note that it is the \`k\`-th largest element in sorted order, not the \`k\`-th distinct element.`,
    inputFormat: 'First line contains N and K. Second line contains N space-separated integers.',
    outputFormat: 'Print the K-th largest integer.',
    constraints: '1 <= K <= N <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      {
        input: '6 2\n3 2 1 5 6 4',
        output: '5',
        explanation: 'Sorted in descending order: 6, 5, 4, 3, 2, 1. The 2nd largest is 5.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n, k = int(tokens[0]), int(tokens[1])
    nums = [int(x) for x in tokens[2:2+n]]
    nums.sort(reverse=True)
    print(nums[k-1])

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const k = parseInt(tokens[1], 10);
  const nums = tokens.slice(2, 2 + n).map(Number);
  nums.sort((a, b) => b - a);
  console.log(nums[k - 1]);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    sort(nums.rbegin(), nums.rend());
    cout << nums[k - 1] << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '6 2\n3 2 1 5 6 4',
        expectedOutput: '5',
        explanation: '2nd largest element is 5',
      },
    ],
    hiddenTestCases: [
      {
        input: '9 4\n3 2 3 1 2 4 5 5 6',
        expectedOutput: '4',
      },
      {
        input: '1 1\n99',
        expectedOutput: '99',
      },
    ],
    tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap'],
  },

  // 15. RECURSION - Power of Two (Easy)
  {
    title: 'Power of Two',
    topic: 'Recursion',
    difficulty: 'Easy',
    description: `Given an integer \`n\`, return \`true\` if it is a power of two. Otherwise, return \`false\`.

An integer \`n\` is a power of two if there exists an integer \`x\` such that \`n == 2^x\`.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print "true" or "false".',
    constraints: '-2^31 <= N <= 2^31 - 1',
    examples: [
      {
        input: '1',
        output: 'true',
        explanation: '2^0 = 1',
      },
      {
        input: '16',
        output: 'true',
        explanation: '2^4 = 16',
      },
      {
        input: '3',
        output: 'false',
        explanation: '3 is not a power of 2',
      },
    ],
    starterCode: {
      python: `import sys

def is_power_of_two(n):
    if n <= 0:
        return False
    if n == 1:
        return True
    if n % 2 != 0:
        return False
    return is_power_of_two(n // 2)

def solve():
    token = sys.stdin.read().split()
    if not token:
        return
    n = int(token[0])
    print("true" if is_power_of_two(n) else "false")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function isPowerOfTwo(n) {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 2 !== 0) return false;
  return isPowerOfTwo(Math.floor(n / 2));
}

function solve() {
  const token = fs.readFileSync(0, 'utf-8').trim();
  if (!token) return;
  const n = parseInt(token, 10);
  console.log(isPowerOfTwo(n) ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
using namespace std;

bool isPowerOfTwo(long long n) {
    if (n <= 0) return false;
    if (n == 1) return true;
    if (n % 2 != 0) return false;
    return isPowerOfTwo(n / 2);
}

int main() {
    long long n;
    if (cin >> n) {
        cout << (isPowerOfTwo(n) ? "true" : "false") << "\\n";
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '16',
        expectedOutput: 'true',
        explanation: '2^4 = 16',
      },
      {
        input: '3',
        expectedOutput: 'false',
        explanation: 'Not power of 2',
      },
    ],
    hiddenTestCases: [
      {
        input: '0',
        expectedOutput: 'false',
      },
      {
        input: '1024',
        expectedOutput: 'true',
      },
      {
        input: '-16',
        expectedOutput: 'false',
      },
    ],
    tags: ['Math', 'Bit Manipulation', 'Recursion'],
  },

  // 16. TREES - Maximum Depth of Binary Tree (Easy)
  {
    title: 'Maximum Depth of Binary Tree',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given the root of a binary tree represented as level-order traversal with -1 representing null, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    inputFormat: 'First line contains integer N. Second line contains N level-order node values (-1 represents null node).',
    outputFormat: 'Print the integer maximum depth.',
    constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100',
    examples: [
      {
        input: '7\n3 9 20 -1 -1 15 7',
        output: '3',
        explanation: 'Max depth is 3 (3 -> 20 -> 15/7).',
      },
    ],
    starterCode: {
      python: `import sys
from collections import deque

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    if n == 0:
        print(0)
        return
    vals = [int(x) for x in tokens[1:n+1]]
    if vals[0] == -1:
        print(0)
        return

    # BFS to compute depth
    queue = deque([(0, 1)]) # (index, depth)
    max_depth = 1
    while queue:
        idx, depth = queue.popleft()
        max_depth = max(max_depth, depth)
        left = 2 * idx + 1
        right = 2 * idx + 2
        if left < n and vals[left] != -1:
            queue.append((left, depth + 1))
        if right < n and vals[right] != -1:
            queue.append((right, depth + 1))
    print(max_depth)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  if (n === 0) { console.log(0); return; }
  const vals = tokens.slice(1, n + 1).map(Number);
  if (vals[0] === -1) { console.log(0); return; }

  const queue = [{ idx: 0, depth: 1 }];
  let maxDepth = 1;
  while (queue.length > 0) {
    const { idx, depth } = queue.shift();
    maxDepth = Math.max(maxDepth, depth);
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    if (left < n && vals[left] !== -1) queue.push({ idx: left, depth: depth + 1 });
    if (right < n && vals[right] !== -1) queue.push({ idx: right, depth: depth + 1 });
  }
  console.log(maxDepth);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n) || n == 0) { cout << 0 << "\\n"; return 0; }
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    if (vals[0] == -1) { cout << 0 << "\\n"; return 0; }

    queue<pair<int, int>> q;
    q.push({0, 1});
    int max_depth = 1;
    while (!q.empty()) {
        auto cur = q.front(); q.pop();
        int idx = cur.first, depth = cur.second;
        max_depth = max(max_depth, depth);
        int l = 2 * idx + 1, r = 2 * idx + 2;
        if (l < n && vals[l] != -1) q.push({l, depth + 1});
        if (r < n && vals[right=r] != -1) q.push({r, depth + 1});
    }
    cout << max_depth << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '7\n3 9 20 -1 -1 15 7',
        expectedOutput: '3',
        explanation: 'Tree has 3 levels',
      },
    ],
    hiddenTestCases: [
      {
        input: '2\n1 -1',
        expectedOutput: '1',
      },
      {
        input: '3\n1 2 3',
        expectedOutput: '2',
      },
    ],
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
  },

  // 17. TREES - Invert Binary Tree (Easy)
  {
    title: 'Invert Binary Tree',
    topic: 'Trees',
    difficulty: 'Easy',
    description: `Given the root of a binary tree represented as an array (level-order traversal with complete binary tree indexing), invert the tree, and return its level-order representation.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print the level-order representation of the inverted tree.',
    constraints: '0 <= N <= 100',
    examples: [
      {
        input: '7\n4 2 7 1 3 6 9',
        output: '4 7 2 9 6 3 1',
        explanation: 'Inverted mirror tree values.',
      },
    ],
    starterCode: {
      python: `import sys

def invert(arr, idx):
    if idx >= len(arr):
        return
    l = 2 * idx + 1
    r = 2 * idx + 2
    if l < len(arr) and r < len(arr):
        arr[l], arr[r] = arr[r], arr[l]
        invert(arr, l)
        invert(arr, r)

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    vals = [int(x) for x in tokens[1:n+1]]
    invert(vals, 0)
    print(' '.join(map(str, vals)))

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function invert(arr, idx) {
  if (idx >= arr.length) return;
  const l = 2 * idx + 1;
  const r = 2 * idx + 2;
  if (l < arr.length && r < arr.length) {
    const tmp = arr[l];
    arr[l] = arr[r];
    arr[r] = tmp;
    invert(arr, l);
    invert(arr, r);
  }
}

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  const vals = tokens.slice(1, n + 1).map(Number);
  invert(vals, 0);
  console.log(vals.join(' '));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void invert(vector<int>& arr, int idx) {
    if (idx >= (int)arr.size()) return;
    int l = 2 * idx + 1, r = 2 * idx + 2;
    if (l < (int)arr.size() && r < (int)arr.size()) {
        swap(arr[l], arr[r]);
        invert(arr, l);
        invert(arr, r);
    }
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    invert(vals, 0);
    for (int i = 0; i < n; i++) {
        cout << vals[i] << (i + 1 == n ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '7\n4 2 7 1 3 6 9',
        expectedOutput: '4 7 2 9 6 3 1',
        explanation: 'Inverted binary tree',
      },
    ],
    hiddenTestCases: [
      {
        input: '3\n2 1 3',
        expectedOutput: '2 3 1',
      },
      {
        input: '1\n1',
        expectedOutput: '1',
      },
    ],
    tags: ['Tree', 'Binary Tree', 'Recursion'],
  },

  // 18. GRAPHS - Number of Islands (Medium)
  {
    title: 'Number of Islands',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    inputFormat: 'First line contains R and C (rows and columns). Next R lines each contain C space-separated characters ("1" or "0").',
    outputFormat: 'Print the integer number of islands.',
    constraints: '1 <= R, C <= 300\ngrid[i][j] is "0" or "1".',
    examples: [
      {
        input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
        output: '1',
        explanation: 'Single connected component of land.',
      },
      {
        input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1',
        output: '3',
        explanation: 'Three separate islands.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    r, c = int(tokens[0]), int(tokens[1])
    grid = []
    idx = 2
    for _ in range(r):
        grid.append(tokens[idx:idx+c])
        idx += c
        
    def dfs(i, j):
        if i < 0 or i >= r or j < 0 or j >= c or grid[i][j] != '1':
            return
        grid[i][j] = '0'
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
        
    islands = 0
    for i in range(r):
        for j in range(c):
            if grid[i][j] == '1':
                islands += 1
                dfs(i, j)
                
    print(islands)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const r = parseInt(tokens[0], 10);
  const c = parseInt(tokens[1], 10);
  const grid = [];
  let idx = 2;
  for (let i = 0; i < r; i++) {
    grid.push(tokens.slice(idx, idx + c));
    idx += c;
  }

  function dfs(i, j) {
    if (i < 0 || i >= r || j < 0 || j >= c || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }

  let islands = 0;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i][j] === '1') {
        islands++;
        dfs(i, j);
      }
    }
  }
  console.log(islands);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int r, c;
vector<vector<char>> grid;

void dfs(int i, int j) {
    if (i < 0 || i >= r || j < 0 || j >= c || grid[i][j] != '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
}

int main() {
    if (!(cin >> r >> c)) return 0;
    grid.assign(r, vector<char>(c));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) cin >> grid[i][j];
    }
    int islands = 0;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grid[i][j] == '1') {
                islands++;
                dfs(i, j);
            }
        }
    }
    cout << islands << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
        expectedOutput: '1',
        explanation: '1 island',
      },
      {
        input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1',
        expectedOutput: '3',
        explanation: '3 disconnected islands',
      },
    ],
    hiddenTestCases: [
      {
        input: '1 1\n0',
        expectedOutput: '0',
      },
      {
        input: '2 2\n1 0\n0 1',
        expectedOutput: '2',
      },
      {
        input: '3 3\n1 1 1\n1 0 1\n1 1 1',
        expectedOutput: '1',
      },
    ],
    tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'],
  },

  // 19. GREEDY - Jump Game (Medium)
  {
    title: 'Jump Game',
    topic: 'Greedy',
    difficulty: 'Medium',
    description: `You are given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= N <= 10^4\n0 <= nums[i] <= 10^5',
    examples: [
      {
        input: '5\n2 3 1 1 4',
        output: 'true',
        explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.',
      },
      {
        input: '5\n3 2 1 0 4',
        output: 'false',
        explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    
    max_reach = 0
    for i, num in enumerate(nums):
        if i > max_reach:
            print("false")
            return
        max_reach = max(max_reach, i + num)
        if max_reach >= n - 1:
            print("true")
            return
    print("true" if max_reach >= n - 1 else "false")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  const nums = tokens.slice(1, n + 1).map(Number);

  let maxReach = 0;
  for (let i = 0; i < n; i++) {
    if (i > maxReach) {
      console.log("false");
      return;
    }
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= n - 1) {
      console.log("true");
      return;
    }
  }
  console.log(maxReach >= n - 1 ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int max_reach = 0;
    for (int i = 0; i < n; i++) {
        if (i > max_reach) { cout << "false\\n"; return 0; }
        max_reach = max(max_reach, i + nums[i]);
        if (max_reach >= n - 1) { cout << "true\\n"; return 0; }
    }
    cout << (max_reach >= n - 1 ? "true" : "false") << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '5\n2 3 1 1 4',
        expectedOutput: 'true',
        explanation: 'Reachable',
      },
      {
        input: '5\n3 2 1 0 4',
        expectedOutput: 'false',
        explanation: 'Blocked at 0',
      },
    ],
    hiddenTestCases: [
      {
        input: '1\n0',
        expectedOutput: 'true',
      },
      {
        input: '2\n2 0',
        expectedOutput: 'true',
      },
    ],
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
  },

  // 20. DYNAMIC PROGRAMMING - Climbing Stairs (Easy)
  {
    title: 'Climbing Stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the integer number of ways.',
    constraints: '1 <= N <= 45',
    examples: [
      {
        input: '2',
        output: '2',
        explanation: 'There are two ways to climb to the top: (1 step + 1 step) or (2 steps).',
      },
      {
        input: '3',
        output: '3',
        explanation: 'There are three ways: (1+1+1), (1+2), (2+1).',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    token = sys.stdin.read().split()
    if not token:
        return
    n = int(token[0])
    if n <= 2:
        print(n)
        return
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const token = fs.readFileSync(0, 'utf-8').trim();
  if (!token) return;
  const n = parseInt(token, 10);
  if (n <= 2) { console.log(n); return; }
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  console.log(b);
}

solve();
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        if (n <= 2) { cout << n << "\\n"; return 0; }
        long long a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            long long next = a + b;
            a = b;
            b = next;
        }
        cout << b << "\\n";
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '2',
        expectedOutput: '2',
        explanation: '2 ways',
      },
      {
        input: '3',
        expectedOutput: '3',
        explanation: '3 ways',
      },
    ],
    hiddenTestCases: [
      {
        input: '4',
        expectedOutput: '5',
      },
      {
        input: '5',
        expectedOutput: '8',
      },
      {
        input: '10',
        expectedOutput: '89',
      },
    ],
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
  },

  // 21. DYNAMIC PROGRAMMING - Coin Change (Medium)
  {
    title: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    inputFormat: 'First line contains N and amount. Second line contains N space-separated coin denominations.',
    outputFormat: 'Print the minimum number of coins needed or -1.',
    constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
    examples: [
      {
        input: '3 11\n1 2 5',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins)',
      },
      {
        input: '1 3\n2',
        output: '-1',
        explanation: 'Cannot make 3 with only 2-denomination coins.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n, amount = int(tokens[0]), int(tokens[1])
    coins = [int(x) for x in tokens[2:2+n]]
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
            
    print(dp[amount] if dp[amount] != float('inf') else -1)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length < 2) return;
  const n = parseInt(tokens[0], 10);
  const amount = parseInt(tokens[1], 10);
  const coins = tokens.slice(2, 2 + n).map(Number);

  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }
  console.log(dp[amount] !== Infinity ? dp[amount] : -1);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, amount;
    if (!(cin >> n >> amount)) return 0;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];

    vector<long long> dp(amount + 1, 1e9);
    dp[0] = 0;
    for (int coin : coins) {
        for (int x = coin; x <= amount; x++) {
            dp[x] = min(dp[x], dp[x - coin] + 1);
        }
    }
    cout << (dp[amount] >= 1e9 ? -1 : dp[amount]) << "\\n";
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '3 11\n1 2 5',
        expectedOutput: '3',
        explanation: '5 + 5 + 1 = 11',
      },
      {
        input: '1 3\n2',
        expectedOutput: '-1',
        explanation: 'Cannot form amount 3',
      },
    ],
    hiddenTestCases: [
      {
        input: '1 0\n1',
        expectedOutput: '0',
      },
      {
        input: '4 18\n2 5 10 1',
        expectedOutput: '4',
      },
    ],
    tags: ['Array', 'Dynamic Programming', 'BFS'],
  },

  // 22. RECURSION - Subsets / Power Set (Medium)
  {
    title: 'Generate Subsets',
    topic: 'Recursion',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Print the total count of subsets.`,
    inputFormat: 'First line contains integer N. Second line contains N unique integers.',
    outputFormat: 'Print the integer number of subsets (which is 2^N).',
    constraints: '1 <= N <= 20',
    examples: [
      {
        input: '3\n1 2 3',
        output: '8',
        explanation: '2^3 = 8 total subsets.',
      },
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    print(1 << n)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
  const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
  if (!tokens || tokens.length === 0 || tokens[0] === '') return;
  const n = parseInt(tokens[0], 10);
  console.log(Math.pow(2, n));
}

solve();
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        cout << (1LL << n) << "\\n";
    }
    return 0;
}
`,
    },
    sampleTestCases: [
      {
        input: '3\n1 2 3',
        expectedOutput: '8',
        explanation: 'Power set size 2^3 = 8',
      },
    ],
    hiddenTestCases: [
      {
        input: '1\n0',
        expectedOutput: '2',
      },
      {
        input: '4\n1 2 3 4',
        expectedOutput: '16',
      },
    ],
    tags: ['Array', 'Backtracking', 'Bit Manipulation'],
  },
];

module.exports = problemsData;
