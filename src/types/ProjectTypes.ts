export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'cpp'
  | 'java'
  | 'kotlin'
  | 'html'
  | 'css'
  | 'markdown'
  | 'plaintext';

export interface ProjectTemplate {
  id: string;
  name: string;
  language: Language;
  description: string;
  defaultFile: string;
  files: {
    [key: string]: string;
  };
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'java-console',
    name: 'Java Console App',
    language: 'java',
    description: 'Java console application with main class',
    defaultFile: 'Main.java',
    files: {
      'Main.java': `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
      'README.md': '# Java Console Application\n\nA simple Java console application.'
    }
  },
  {
    id: 'kotlin-console',
    name: 'Kotlin Console App',
    language: 'kotlin',
    description: 'Kotlin console application',
    defaultFile: 'Main.kt',
    files: {
      'Main.kt': `fun main() {
    println("Hello, Kotlin!")
    
    // Example of Kotlin features
    val numbers = listOf(1, 2, 3, 4, 5)
    numbers.filter { it % 2 == 0 }
           .map { it * 2 }
           .forEach { println(it) }
}`,
      'README.md': '# Kotlin Console Application\n\nA simple Kotlin console application.'
    }
  },
  {
    id: 'python',
    name: 'Python',
    language: 'python',
    description: 'Python project with main script',
    defaultFile: 'main.py',
    files: {
      'main.py': `def main():
    print("Hello, Python!")
    
    # Example of Python features
    numbers = [1, 2, 3, 4, 5]
    squares = [x**2 for x in numbers]
    print(f"Squares: {squares}")

if __name__ == "__main__":
    main()`,
      'README.md': '# Python Project\n\nA simple Python application.'
    }
  },
  {
    id: 'web',
    name: 'Web Project',
    language: 'html',
    description: 'Web project with HTML, CSS, and JavaScript',
    defaultFile: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello, Web!</h1>
        <p>Edit this template to start your web project.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      'styles.css': `body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background: #f0f0f0;
}

.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
      'script.js': `// Your JavaScript code here
console.log('Web project initialized!');`,
      'README.md': '# Web Project\n\nA web project template with HTML, CSS, and JavaScript.'
    }
  },
  {
    id: 'cpp',
    name: 'C++',
    language: 'cpp',
    description: 'C++ project with main file',
    defaultFile: 'main.cpp',
    files: {
      'main.cpp': `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    
    // Example of C++ features
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::for_each(numbers.begin(), numbers.end(), 
        [](int n) { std::cout << n * 2 << " "; });
    
    return 0;
}`,
      'README.md': '# C++ Project\n\nA simple C++ application.'
    }
  },
  {
    id: 'markdown',
    name: 'Documentation',
    language: 'markdown',
    description: 'Markdown documentation project',
    defaultFile: 'README.md',
    files: {
      'README.md': `# Project Documentation

## Overview

This is a template for creating documentation using Markdown.

## Features

- Easy to read and write
- Supports code blocks
- Includes formatting options

## Code Example

\`\`\`javascript
console.log('Hello from documentation!');
\`\`\`

## Next Steps

1. Edit this template
2. Add your content
3. Preview the results`
    }
  }
];