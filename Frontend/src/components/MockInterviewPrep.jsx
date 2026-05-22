import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Camera, Mic, PhoneOff, VideoOff, ArrowRightCircle, ArrowLeftCircle, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import * as faceapi from 'face-api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Domain-specific interview questions
const interviewQuestionsByDomain = {
  'Cloud Computing': [
    "What is cloud computing and what are its main service models (IaaS, PaaS, SaaS)?",
    "Can you explain the concept of virtualization and how it relates to cloud computing?",
    "What are the benefits of using cloud computing ?",
    "What is the difference between public, private, and hybrid clouds?",
    "How do you ensure security in a cloud environment?",
    "What is serverless computing and how does it differ from traditional cloud services?",
    "Can you explain the concept of auto-scaling in cloud computing?",
    "What are some common use cases for cloud computing?",
  ],
  
  'Frontend': [
    "Can you explain the difference between let, const, and var?",
    "What is the Box Model in CSS?",
    "Explain the concept of closures in JavaScript.",
    "What are React Hooks? Can you name a few and explain their purpose?",
    "Describe the difference between == and === in JavaScript.",
    "What is responsive web design and how do you implement it?",
    "Explain the virtual DOM in React.",
    "What are Promises and why are they useful?",
    "Can you describe the CSS display property and some of its common values?",
    "Tell me about a challenging project you've worked on and how you overcame the obstacles."
  ],
  'Backend': [
    "What is RESTful API design and its main principles?",
    "Explain the difference between SQL and NoSQL databases. Give an example of each.",
    "What is middleware in the context of a Node.js/Express application?",
    "Describe the process of user authentication and authorization.",
    "What is the purpose of indexing in a database?",
    "Explain the difference between stateful and stateless applications.",
    "What is containerization, and why is Docker a popular choice?",
    "How would you handle errors in an asynchronous API call?",
    "Describe the concept of microservices architecture.",
    "Tell me about a time you had to optimize a slow API endpoint."
  ],
  'Data Structures & Algorithms': [
    "What is the difference between an Array and a Linked List?",
    "Explain Big O notation and its importance.",
    "How does a Hash Table work?",
    "What are the main differences between a Stack and a Queue?",
    "Can you explain the concept of recursion?",
    "Describe how a binary search tree works.",
    "What is the difference between Depth-First Search (DFS) and Breadth-First Search (BFS)?",
    "Explain the concept of dynamic programming.",
    "How would you find the middle element of a linked list in a single pass?",
    "Describe a real-world scenario where you would use a graph data structure."
  ],
  'Operating Systems': [
    "What is the difference between a process and a thread?",
    "Can you explain what a deadlock is and the conditions necessary for it to occur?",
    "What is virtual memory and why is it useful?",
    "Describe the concept of context switching.",
    "What is the purpose of a semaphore and a mutex?",
    "Explain the difference between paging and segmentation.",
    "What is thrashing in the context of virtual memory?",
    "What is the role of the kernel in an operating system?",
    "Compare different CPU scheduling algorithms like FCFS, SJF, and Round Robin.",
    "What is the difference between user-level threads and kernel-level threads?"
  ],
  'Computer Networks': [
    "Can you explain the 7 layers of the OSI model?",
    "What is the difference between TCP and UDP?",
    "What is DNS and what is its purpose?",
    "Explain the TCP three-way handshake.",
    "What is the difference between an IP address and a MAC address?",
    "Describe the roles of a router, a switch, and a hub.",
    "What is the difference between HTTP and HTTPS?",
    "What is a subnet mask used for?",
    "Explain the concept of DHCP.",
    "What is a firewall and how does it work?"
  ],
  'DBMS': [
    "What are the ACID properties in a transaction?",
    "Explain the concept of database normalization and its different forms (1NF, 2NF, 3NF).",
    "What is the difference between a primary key and a foreign key?",
    "What are different types of joins in SQL (e.g., INNER, LEFT, RIGHT)?",
    "What is an index in a database and why is it important?",
    "What is the difference between the DELETE, TRUNCATE, and DROP commands in SQL?",
    "Explain the concept of a database transaction.",
    "What is the difference between SQL and NoSQL databases?",
    "Describe what a database schema is.",
    "What is the purpose of the GROUP BY clause in a SQL query?"
  ],
  'Java': [
    "What is the difference between the JDK, JRE, and JVM?",
    "What are the main principles of Object-Oriented Programming?",
    "Explain the difference between an interface and an abstract class in Java.",
    "What is the difference between method overloading and method overriding?",
    "Can you explain the static keyword in Java?",
    "What is the difference between String, StringBuilder, and StringBuffer?",
    "What is the Java Collection Framework?",
    "Explain how exception handling works in Java using try, catch, and finally.",
    "What are Java Streams and what are they used for?",
    "Describe the difference between final, finally, and finalize."
  ],
  'Python': [
    "What is the difference between a list and a tuple in Python?",
    "Can you explain the Global Interpreter Lock (GIL) in CPython?",
    "What are decorators and how do you use them in Python?",
    "What is the difference between __init__ and __new__?",
    "What are list comprehensions? Provide an example.",
    "What is a generator in Python and why would you use one?",
    "How does memory management work in Python?",
    "What is the difference between *args and **kwargs?",
    "What is the difference between a .py and a .pyc file?",
    "Explain the concept of monkey-patching in Python."
  ],
  'MySQL': [
    "What are the different storage engines available in MySQL, like InnoDB and MyISAM?",
    "What is an index, and what are the different types of indexes in MySQL?",
    "How would you go about optimizing a slow SQL query?",
    "What is the difference between CHAR and VARCHAR data types?",
    "Explain what a JOIN is and describe the difference between an INNER JOIN and a LEFT JOIN.",
    "What is a transaction in MySQL?",
    "How do you perform a backup and restore of a MySQL database?",
    "What is the purpose of the GROUP BY clause?",
    "What is the difference between the HAVING and WHERE clauses?",
    "Explain the concept of database normalization."
  ]
};

// YouTube URLs for each question in each domain (updated with working, relevant videos from popular channels)
const youtubeUrlsByDomain = {
  'Cloud Computing': [
    "https://www.youtube.com/watch?v=JIUwRGW8F-w", // Cloud Computing basics - Techworldwithraj
    "https://www.youtube.com/watch?v=FOWvHPwZA4c", // Virtualization - Techworldwithraj
    "https://www.youtube.com/watch?v=0QXeJtGN1uw", // Cloud benefits - Techworldwithraj
    "https://www.youtube.com/watch?v=Wc_8D3KqHcw", // Public, Private, Hybrid clouds - Azadehcloud
    "https://www.youtube.com/watch?v=9h_Gd-AaZnU", // Cloud Security - Techworldwithraj
    "https://www.youtube.com/watch?v=AXKpHcbM0Ow", // Serverless Computing - Traversy Media
    "https://www.youtube.com/watch?v=BsDfVKKWbyk", // Auto-scaling - A Cloud Guru
    "https://www.youtube.com/watch?v=JYB_YZT9j70"  // Cloud use cases - Techworldwithraj
  ],
  'Frontend': [
    "https://www.youtube.com/watch?v=9ooYYRLdg_g", // Difference between let, const, var - Traversy Media
    "https://www.youtube.com/watch?v=rIO5326FgPE", // Box Model in CSS - Traversy Media
    "https://www.youtube.com/watch?v=3a0I8ICR1Vg", // Closures in JavaScript - Traversy Media
    "https://www.youtube.com/watch?v=TNhaISOUy6Q", // React Hooks - Traversy Media
    "https://www.youtube.com/watch?v=CxgOKJh4zWE", // == vs === - Traversy Media
    "https://www.youtube.com/watch?v=srvUrASNj0s", // Responsive web design - Traversy Media
    "https://www.youtube.com/watch?v=8aGhZQkoFbQ", // Virtual DOM in React - Traversy Media
    "https://www.youtube.com/watch?v=DHvZLI7Db8E", // Promises in JavaScript - Traversy Media
    "https://www.youtube.com/watch?v=04e4PYDgJfU", // CSS display property - Traversy Media
    "https://www.youtube.com/watch?v=8aGhZQkoFbQ"  // Challenging project example - Traversy Media
  ],
  'Backend': [
    "https://www.youtube.com/watch?v=lsMQRaeKNDk", // RESTful API design - Traversy Media
    "https://www.youtube.com/watch?v=cQP8WJjvwAg", // SQL vs NoSQL - Traversy Media
    "https://www.youtube.com/watch?v=lY6icfhap2o", // Middleware in Node.js - Traversy Media
    "https://www.youtube.com/watch?v=7Q17ubqLfaM", // Authentication and Authorization - Traversy Media
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Indexing in databases - Traversy Media
    "https://www.youtube.com/watch?v=L1rs6WQFUhQ", // Stateful vs Stateless - Traversy Media
    "https://www.youtube.com/watch?v=0qotVMX-J5s", // Containerization with Docker - Traversy Media
    "https://www.youtube.com/watch?v=DHvZLI7Db8E", // Error handling in async APIs - Traversy Media
    "https://www.youtube.com/watch?v=3bGjXcRmH5g", // Microservices architecture - Traversy Media
    "https://www.youtube.com/watch?v=HXV3zeQKqGY"  // Optimizing slow API - Traversy Media
  ],
  'Data Structures & Algorithms': [
    "https://www.youtube.com/watch?v=8hly31xKli0", // Array vs Linked List - freeCodeCamp
    "https://www.youtube.com/watch?v=0oDAlMwTrLo", // Big O notation - freeCodeCamp
    "https://www.youtube.com/watch?v=2E54GqF0H4s", // Hash Table - freeCodeCamp
    "https://www.youtube.com/watch?v=FEnwM-iDb2g", // Stack vs Queue - freeCodeCamp
    "https://www.youtube.com/watch?v=vYquumk4nWw", // Recursion - freeCodeCamp
    "https://www.youtube.com/watch?v=H5JubkIy_p8", // Binary Search Tree - freeCodeCamp
    "https://www.youtube.com/watch?v=pcKY4hjDrxk", // DFS vs BFS - freeCodeCamp
    "https://www.youtube.com/watch?v=nqlNzOcnCfs", // Dynamic Programming - freeCodeCamp
    "https://www.youtube.com/watch?v=8hly31xKli0", // Middle element in linked list - freeCodeCamp
    "https://www.youtube.com/watch?v=pcKY4hjDrxk"  // Graph data structure - freeCodeCamp
  ],
  'Operating Systems': [
    "https://www.youtube.com/watch?v=3aLdNH3LKhc", // Process vs Thread - freeCodeCamp
    "https://www.youtube.com/watch?v=UVQZPJBW-kk", // Deadlock - freeCodeCamp
    "https://www.youtube.com/watch?v=qeXPQGPgYzM", // Virtual Memory - freeCodeCamp
    "https://www.youtube.com/watch?v=3aLdNH3LKhc", // Context Switching - freeCodeCamp
    "https://www.youtube.com/watch?v=UVQZPJBW-kk", // Semaphore and Mutex - freeCodeCamp
    "https://www.youtube.com/watch?v=qeXPQGPgYzM", // Paging vs Segmentation - freeCodeCamp
    "https://www.youtube.com/watch?v=qeXPQGPgYzM", // Thrashing - freeCodeCamp
    "https://www.youtube.com/watch?v=3aLdNH3LKhc", // Kernel in OS - freeCodeCamp
    "https://www.youtube.com/watch?v=3aLdNH3LKhc", // CPU Scheduling - freeCodeCamp
    "https://www.youtube.com/watch?v=3aLdNH3LKhc"  // User vs Kernel threads - freeCodeCamp
  ],
  'Computer Networks': [
    "https://www.youtube.com/watch?v=7_LPdttKXPc", // OSI Model - freeCodeCamp
    "https://www.youtube.com/watch?v=0zIcQdJa5gU", // TCP vs UDP - freeCodeCamp
    "https://www.youtube.com/watch?v=2ZUxoi7YNgs", // DNS - freeCodeCamp
    "https://www.youtube.com/watch?v=0zIcQdJa5gU", // TCP three-way handshake - freeCodeCamp
    "https://www.youtube.com/watch?v=7_LPdttKXPc", // IP vs MAC address - freeCodeCamp
    "https://www.youtube.com/watch?v=7_LPdttKXPc", // Router, Switch, Hub - freeCodeCamp
    "https://www.youtube.com/watch?v=2ZUxoi7YNgs", // HTTP vs HTTPS - freeCodeCamp
    "https://www.youtube.com/watch?v=7_LPdttKXPc", // Subnet Mask - freeCodeCamp
    "https://www.youtube.com/watch?v=2ZUxoi7YNgs", // DHCP - freeCodeCamp
    "https://www.youtube.com/watch?v=2ZUxoi7YNgs"  // Firewall - freeCodeCamp
  ],
  'DBMS': [
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // ACID properties - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Database normalization - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Primary vs Foreign key - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // SQL Joins - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Index in database - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // DELETE vs TRUNCATE vs DROP - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Database transaction - freeCodeCamp
    "https://www.youtube.com/watch?v=cQP8WJjvwAg", // SQL vs NoSQL - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Database schema - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY"  // GROUP BY clause - freeCodeCamp
  ],
  'Java': [
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // JDK, JRE, JVM - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // OOP principles - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // Interface vs Abstract class - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // Overloading vs Overriding - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // Static keyword - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // String vs StringBuilder vs StringBuffer - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // Java Collection Framework - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // Exception handling - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs", // Java Streams - freeCodeCamp
    "https://www.youtube.com/watch?v=IJ-PJbvJBGs"  // Final, Finally, Finalize - freeCodeCamp
  ],
  'Python': [
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // List vs Tuple - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // GIL in CPython - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // Decorators - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // __init__ vs __new__ - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // List comprehensions - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // Generator in Python - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // Memory management - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // *args and **kwargs - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA", // .py vs .pyc - freeCodeCamp
    "https://www.youtube.com/watch?v=WOwi0h_-dfA"  // Monkey patching - freeCodeCamp
  ],
  'MySQL': [
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // InnoDB vs MyISAM - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Index types in MySQL - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Optimizing slow queries - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // CHAR vs VARCHAR - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // INNER JOIN vs LEFT JOIN - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Transaction in MySQL - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // Backup and restore - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // GROUP BY clause - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY", // HAVING vs WHERE - freeCodeCamp
    "https://www.youtube.com/watch?v=HXV3zeQKqGY"  // Normalization - freeCodeCamp
  ]
};

// Expected keywords/phrases for scoring (case-insensitive)
const interviewAnswersByDomain = {
  'Cloud Computing': [
    ["cloud computing", "service models", "iaas", "paas", "saas", "on-demand", "pay-as-you-go"],
    ["virtualization", "hypervisor", "virtual machines", "vms", "isolation", "resource sharing"],
    ["benefits", "scalability", "cost-effective", "flexibility", "accessibility", "reliability", "availability"],
    ["public cloud", "private cloud", "hybrid cloud", "multi-cloud", "security", "compliance", "control"],
    ["security", "encryption", "authentication", "authorization", "data protection", "firewalls", "compliance"],
    ["serverless", "faas", "function-as-a-service", "lambda", "event-driven", "no infrastructure", "pay-per-execution"],
    ["auto-scaling", "load balancing", "elastic", "demand", "performance", "cost optimization", "availability"],
    ["use cases", "web applications", "big data", "machine learning", "hosting", "backup", "disaster recovery"]
  ],
  'Frontend': [
    ["let", "const", "var", "block scope", "function scope", "reassignment", "redeclaration"],
    ["box model", "content", "padding", "border", "margin", "width", "height"],
    ["closure", "function", "lexical scope", "inner function", "outer function", "variables"],
    ["react hooks", "useState", "useEffect", "useContext", "state", "lifecycle", "side effects"],
    ["==", "===", "equality", "strict equality", "type coercion", "comparison"],
    ["responsive", "media queries", "flexbox", "grid", "viewport", "breakpoints"],
    ["virtual dom", "react", "diffing", "reconciliation", "performance", "updates"],
    ["promises", "asynchronous", "resolve", "reject", "then", "catch", "async/await"],
    ["display", "block", "inline", "flex", "grid", "none", "visibility"],
    ["project", "challenge", "overcome", "solution", "learning", "experience"]
  ],
  'Backend': [
    ["restful", "api", "principles", "stateless", "cacheable", "uniform interface"],
    ["sql", "nosql", "relational", "mongodb", "mysql", "scalability", "flexibility"],
    ["middleware", "node.js", "express", "request", "response", "authentication", "logging"],
    ["authentication", "authorization", "jwt", "session", "oauth", "password", "token"],
    ["indexing", "database", "performance", "query", "search", "primary key", "foreign key"],
    ["stateful", "stateless", "session", "data", "server", "client", "scalability"],
    ["containerization", "docker", "isolation", "portability", "microservices", "deployment"],
    ["errors", "asynchronous", "try", "catch", "promise", "callback", "exception"],
    ["microservices", "architecture", "scalability", "independence", "api", "deployment"],
    ["optimize", "api", "endpoint", "database", "caching", "indexing", "profiling"]
  ],
  'Data Structures & Algorithms': [
    ["array", "linked list", "insertion", "deletion", "access", "memory"],
    ["big o", "notation", "time complexity", "space complexity", "asymptotic", "analysis"],
    ["hash table", "hash function", "collision", "buckets", "key", "value"],
    ["stack", "queue", "lifo", "fifo", "push", "pop", "enqueue", "dequeue"],
    ["recursion", "base case", "recursive case", "call stack", "factorial", "fibonacci"],
    ["binary search tree", "bst", "inorder", "preorder", "postorder", "balanced"],
    ["dfs", "bfs", "depth-first", "breadth-first", "graph", "traversal", "tree"],
    ["dynamic programming", "memoization", "tabulation", "optimization", "subproblems"],
    ["linked list", "middle", "two pointers", "fast", "slow", "single pass"],
    ["graph", "nodes", "edges", "social network", "routing", "recommendation"]
  ],
  'Operating Systems': [
    ["process", "thread", "multitasking", "cpu", "memory", "execution"],
    ["deadlock", "mutual exclusion", "hold and wait", "no preemption", "circular wait"],
    ["virtual memory", "paging", "swapping", "address space", "physical memory"],
    ["context switching", "process", "state", "cpu", "registers", "overhead"],
    ["semaphore", "mutex", "synchronization", "critical section", "lock", "unlock"],
    ["paging", "segmentation", "memory management", "virtual address", "physical address"],
    ["thrashing", "page fault", "swap", "performance", "memory", "cpu"],
    ["kernel", "operating system", "hardware", "system calls", "drivers", "scheduler"],
    ["fcfs", "sjf", "round robin", "scheduling", "cpu", "waiting time", "turnaround"],
    ["user-level", "kernel-level", "threads", "library", "os", "context switch"]
  ],
  'Computer Networks': [
    ["osi", "model", "layers", "physical", "data link", "network", "transport", "session", "presentation", "application"],
    ["tcp", "udp", "connection-oriented", "connectionless", "reliability", "speed"],
    ["dns", "domain name system", "ip address", "hostname", "resolution", "server"],
    ["tcp", "three-way handshake", "syn", "ack", "connection", "establishment"],
    ["ip address", "mac address", "network", "data link", "routing", "switching"],
    ["router", "switch", "hub", "network", "layer", "routing", "broadcast"],
    ["http", "https", "secure", "ssl", "tls", "encryption", "port 443"],
    ["subnet mask", "network", "host", "ip address", "cidr", "routing"],
    ["dhcp", "dynamic host configuration protocol", "ip address", "lease", "server"],
    ["firewall", "security", "traffic", "rules", "filtering", "intrusion"]
  ],
  'DBMS': [
    ["acid", "atomicity", "consistency", "isolation", "durability", "transaction"],
    ["normalization", "1nf", "2nf", "3nf", "redundancy", "dependencies", "anomalies"],
    ["primary key", "foreign key", "unique", "reference", "relationship", "integrity"],
    ["joins", "inner", "left", "right", "full", "cartesian", "union"],
    ["index", "database", "performance", "query", "search", "b-tree", "hash"],
    ["delete", "truncate", "drop", "table", "data", "structure", "rollback"],
    ["transaction", "commit", "rollback", "savepoint", "concurrency", "isolation"],
    ["sql", "nosql", "relational", "schema", "flexible", "scalability", "json"],
    ["schema", "database", "structure", "tables", "relationships", "constraints"],
    ["group by", "aggregate", "having", "where", "clause", "query", "filter"]
  ],
  'Java': [
    ["jdk", "jre", "jvm", "development", "runtime", "virtual machine", "bytecode"],
    ["oop", "encapsulation", "inheritance", "polymorphism", "abstraction", "class", "object"],
    ["interface", "abstract class", "implementation", "multiple inheritance", "methods"],
    ["overloading", "overriding", "method", "signature", "inheritance", "runtime", "compile"],
    ["static", "keyword", "class", "method", "variable", "instance", "memory"],
    ["string", "stringbuilder", "stringbuffer", "mutable", "immutable", "performance", "thread-safe"],
    ["collection", "framework", "list", "set", "map", "arraylist", "hashmap"],
    ["exception", "try", "catch", "finally", "throw", "throws", "handling"],
    ["streams", "java 8", "functional", "lambda", "filter", "map", "collect"],
    ["final", "finally", "finalize", "keyword", "block", "method", "garbage collection"]
  ],
  'Python': [
    ["list", "tuple", "mutable", "immutable", "indexing", "slicing", "methods"],
    ["gil", "global interpreter lock", "cpython", "threading", "multiprocessing", "performance"],
    ["decorators", "function", "@", "wrapper", "syntax", "sugar", "closure"],
    ["__init__", "__new__", "constructor", "instance", "class", "object", "creation"],
    ["list comprehensions", "syntax", "for", "if", "expression", "readable"],
    ["generator", "yield", "iterator", "memory", "lazy", "function", "next"],
    ["memory", "management", "garbage", "collection", "reference", "counting", "cpython"],
    ["*args", "**kwargs", "arguments", "parameters", "unpacking", "flexible", "function"],
    [".py", ".pyc", "source", "bytecode", "compilation", "import", "speed"],
    ["monkey-patching", "runtime", "modification", "class", "function", "dynamic"]
  ],
  'MySQL': [
    ["innodb", "myisam", "storage engine", "transaction", "locking", "performance"],
    ["index", "btree", "hash", "fulltext", "unique", "composite", "optimization"],
    ["optimize", "query", "explain", "index", "join", "subquery", "profiling"],
    ["char", "varchar", "fixed", "variable", "length", "storage", "performance"],
    ["join", "inner", "left", "right", "on", "using", "null", "matching"],
    ["transaction", "commit", "rollback", "autocommit", "isolation", "level"],
    ["backup", "restore", "mysqldump", "import", "export", "consistency"],
    ["group by", "aggregate", "sum", "count", "avg", "having", "filter"],
    ["having", "where", "group by", "aggregate", "filter", "condition"],
    ["normalization", "1nf", "2nf", "3nf", "redundancy", "dependencies", "anomalies"]
  ]
};

const MockInterview = () => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(null); // State for the final score
  const [questionScores, setQuestionScores] = useState([]); // State for scores per question
  const [transcripts, setTranscripts] = useState([]); // Store transcripts per question
  const [currentTranscript, setCurrentTranscript] = useState(''); // Current question transcript
  const [aiFeedback, setAiFeedback] = useState(null); // Store AI feedback from analysis
  const [aiTestResult, setAiTestResult] = useState(null); // Result of test OpenAI endpoint
  const [speechRecognitionFailed, setSpeechRecognitionFailed] = useState(false); // Track if speech recognition failed
  const [userDetails, setUserDetails] = useState({ name: '', email: '', userId: '', domain: '' });
  const [showUserForm, setShowUserForm] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [pollingFeedback, setPollingFeedback] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [noFaceTimer, setNoFaceTimer] = useState(null);
  const [showNoFaceWarning, setShowNoFaceWarning] = useState(false);
  const [opencvLoaded, setOpencvLoaded] = useState(false);
  const classifierRef = useRef(null);
  const [showCheatingPopup, setShowCheatingPopup] = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Function to calculate score based on transcripts and domain-specific keywords
  const calculateScore = (transcripts, domain) => {
    console.log('📊 [SCORE] calculateScore called with:', {
      transcriptsLength: transcripts?.length,
      domain,
      hasInterviewAnswers: !!interviewAnswersByDomain[domain]
    });
    
    if (!Array.isArray(transcripts) || !domain || !interviewAnswersByDomain[domain]) {
      console.warn('⚠️ [SCORE] Missing required data for score calculation, returning empty array');
      return [];
    }
    
    const scores = transcripts.map((transcript, index) => {
      if (!transcript || transcript.trim() === '') {
        console.log(`📊 [SCORE] Q${index + 1}: Empty transcript = 0`);
        return 0;
      }
      const keywords = interviewAnswersByDomain[domain][index] || [];
      if (!Array.isArray(keywords) || keywords.length === 0) {
        console.log(`📊 [SCORE] Q${index + 1}: No keywords = 0`);
        return 0;
      }
      const matched = keywords.filter(k => transcript.toLowerCase().includes(k.toLowerCase())).length;
      const score = Math.round((matched / keywords.length) * 10);
      console.log(`📊 [SCORE] Q${index + 1}: ${matched}/${keywords.length} keywords matched = ${score}/10`);
      return score;
    });
    
    console.log('📊 [SCORE] Final scores array:', scores);
    return scores;
  };

  const getEyeAspectRatio = (eye) => {
    const a = distance(eye[1], eye[5]);
    const b = distance(eye[2], eye[4]);
    const c = distance(eye[0], eye[3]);
    return (a + b) / (2.0 * c);
  };

  const distance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };


  const startInterview = async () => {
    if (!selectedDomain) {
      setError("Please select an interview domain before starting.");
      return;
    }
    setError('');
    setSpeechRecognitionFailed(false); // Reset speech recognition flag
    setInterviewComplete(false);
    setCurrentQuestionIndex(0);
    setFinalScore(null);
    setActiveQuestions(interviewQuestionsByDomain[selectedDomain] || []);
    setTranscripts([]);
    setCurrentTranscript('');

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setInterviewStarted(true);

      // Start recording
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.start();

      // Start speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Accumulate transcript instead of overwriting - fix for capturing complete answers
          setCurrentTranscript(prev => {
            const newText = finalTranscript || interimTranscript;
            if (!newText) return prev;
            // Append new speech to existing transcript
            const combined = prev ? prev + ' ' + newText : newText;
            return combined.trim();
          });
        };
        
        recognitionRef.current.onend = () => {
          // Only restart if speech recognition hasn't already failed with an error
          if (interviewStarted && !interviewComplete && !speechRecognitionFailed) {
            setTimeout(() => {
              if (recognitionRef.current && !interviewComplete && !speechRecognitionFailed) {
                try {
                  recognitionRef.current.start();
                } catch (e) {
                  console.warn('Could not restart speech recognition');
                }
              }
            }, 1000);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setSpeechRecognitionFailed(true); // Stop trying to restart
          setError(`🎤 Speech recognition error: ${event.error}. No problem! You can type your answer in the text box below instead.`);
        };
        
        recognitionRef.current.start();
      } else {
        setError('Speech recognition not supported in this browser. Please type your answers manually.');
      }

      // Start blink detection (commented out)

      // Blink detection is disabled due to CDN issues
      /*
      if (modelsLoaded) {
        const detectBlinks = async () => {
          if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
            if (detections) {
              const landmarks = detections.landmarks;
              const leftEye = landmarks.getLeftEye();
              const rightEye = landmarks.getRightEye();
              const leftEAR = getEyeAspectRatio(leftEye);
              const rightEAR = getEyeAspectRatio(rightEye);
              const ear = (leftEAR + rightEAR) / 2.0;
              if (ear < 0.25) {
                setBlinkDetected(true);
                setShowCheatingPopup(true);
                setTimeout(() => setBlinkDetected(false), 1000);
              }
            }
          }
          requestAnimationFrame(detectBlinks);
        };
        detectBlinks();
      }
      */

    } catch (err) {
      console.error("Error accessing media devices.", err);
      // Continue with interview even without camera/microphone
      setSpeechRecognitionFailed(true);
      setError("📝 Camera/microphone access failed. No problem! You can type your answers below. Text input mode is now active.");
      setInterviewStarted(true);
    }
  };

  const stopInterview = async () => {
    console.log('🛑 [INTERVIEW] ========== STOPPING INTERVIEW ==========');
    console.log('⏱️ [INTERVIEW] Current state:', {
      transcripts: transcripts.length,
      currentTranscript: currentTranscript.substring(0, 50),
      selectedDomain,
      userId: userDetails.userId,
      mediaRecorderState: mediaRecorderRef.current?.state,
      recognitionState: recognitionRef.current?.continuous
    });
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log('🎤 [INTERVIEW] Speech recognition stopped');
    }

    // **CRITICAL**: Combine all transcripts (saved ones + current one)
    const allTranscripts = [...transcripts, currentTranscript];
    console.log(`📝 [INTERVIEW] ========== TRANSCRIPTS COLLECTED ==========`);
    console.log(`📝 [INTERVIEW] Saved transcripts: ${transcripts.length}`);
    console.log(`📝 [INTERVIEW] Current transcript (Q${currentQuestionIndex + 1}): "${currentTranscript}"`);
    console.log(`📝 [INTERVIEW] TOTAL transcripts: ${allTranscripts.length}`);
    allTranscripts.forEach((t, idx) => {
      console.log(`  📝 Q${idx + 1}: "${t.substring(0, 50)}${t.length > 50 ? '...' : ''}"`);
    });
    
    setTranscripts(allTranscripts);

    // Calculate score
    console.log('📊 [INTERVIEW] Calculating score...');
    const questionScores = calculateScore(allTranscripts, selectedDomain);
    const totalScore = questionScores.reduce((a, b) => a + b, 0);
    console.log(`✅ [INTERVIEW] Score calculated: ${questionScores.join(', ')} = Total: ${totalScore.toFixed(1)}`);
    setFinalScore(totalScore);
    setQuestionScores(questionScores);

    // Stop the camera and microphone tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      console.log('📹 [INTERVIEW] Camera/microphone stopped');
    }
    setStream(null);
    // DON'T set interviewStarted to false yet - we need it for the results page to show

    // Stop the recording and prepare to submit
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('⏹️ [INTERVIEW] MediaRecorder is recording, stopping it...');
      mediaRecorderRef.current.stop();
      
      // Wait for the 'stop' event to be processed
      setTimeout(async () => {
        try {
          console.log('⏳ [BACKEND] Starting backend submission...');
          setAnalyzing(true);
          
          // Create video blob from recorded chunks (if any)
          const videoBlob = recordedChunksRef.current.length > 0 
            ? new Blob(recordedChunksRef.current, { type: 'video/webm' })
            : new Blob([], { type: 'text/plain' }); // Empty blob if no recording
          console.log(`📦 [BACKEND] Video blob size: ${videoBlob.size} bytes`);
          
          // Create FormData for submission
          const formData = new FormData();
          formData.append('file', videoBlob, 'interview.webm');
          formData.append('userId', userDetails.userId);
          formData.append('domain', selectedDomain);
          formData.append('questions', JSON.stringify(activeQuestions));
          formData.append('transcripts', JSON.stringify(allTranscripts));
          
          console.log('📤 [BACKEND] Sending FormData to backend...');
          console.log('📤 [BACKEND] FormData contents:', {
            userId: userDetails.userId,
            domain: selectedDomain,
            questionsCount: activeQuestions.length,
            transcriptsCount: allTranscripts.length
          });
          
          // Submit to backend API
          const response = await fetch(`${API_BASE_URL}/api/mock-interview-feedback/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include' // Include credentials if needed
          });
          
          console.log('📥 [BACKEND] Response received with status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ [BACKEND] Analysis complete! Full response:', result);
            console.log('📝 [BACKEND] Response keys:', Object.keys(result));
            console.log('📝 [BACKEND] Response.success:', result.success);
            console.log('📝 [BACKEND] Response.feedback exists?', !!result.feedback);
            
            // Extract the analysis from the response
            if (result.feedback) {
              console.log('💾 [STATE] Setting aiFeedback with analysis');
              setAiFeedback(result.feedback);
              console.log('📦 [STATE] aiFeedback keys:', Object.keys(result.feedback));
              console.log('📊 [STATE] aiFeedback.analysis exists?', !!result.feedback.analysis);
              console.log('🎯 [STATE] aiFeedback.analysis.ai_feedback exists?', !!result.feedback.analysis?.ai_feedback);
              if (result.feedback.analysis?.ai_feedback) {
                console.log('💬 [STATE] AI Feedback summary:', result.feedback.analysis.ai_feedback.summary);
                console.log('💬 [STATE] Strengths:', result.feedback.analysis.ai_feedback.strengths);
              }
            } else {
              console.warn('⚠️ [BACKEND] No feedback in response! Response was:', result);
            }
          } else {
            console.error('❌ [BACKEND] Backend submission failed with status:', response.status);
            try {
              const errorText = await response.json();
              console.error('❌ [BACKEND] Error response:', errorText);
            } catch (e) {
              const errorText = await response.text();
              console.error('❌ [BACKEND] Error details (text):', errorText);
            }
          }
        } catch (error) {
          console.error('❌ [ERROR] Error submitting interview to backend:', error);
          // Still complete the interview UI even if there's an error
        } finally {
          console.log('🎬 [STATE] Setting interview complete flags');
          setAnalyzing(false);
          setInterviewComplete(true); // Set this FIRST so results page renders
          setInterviewStarted(false); // Then stop the interview UI
          console.log('✅ [STATE] Interview flags set - results page should now render');
        }
      }, 100);
    } else {
      setAnalyzing(false);
      setInterviewComplete(true); // Set this FIRST
      setInterviewStarted(false); // Then stop the interview UI
    }
  };

  const handleNextQuestion = () => {
    // Save current transcript BEFORE moving to next question
    console.log(`📝 [TRANSCRIPT] Q${currentQuestionIndex + 1}: "${currentTranscript}"`);
    setTranscripts(prev => {
      const updated = [...prev, currentTranscript];
      console.log(`📝 [TRANSCRIPT] Total transcripts so far: ${updated.length}`);
      return updated;
    });
    setCurrentTranscript('');

    // Move to the next question, looping back to the first if at the end
    setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % activeQuestions.length);
  };

  const handlePreviousQuestion = () => {
    // Don't go back past the first question
    if (currentQuestionIndex === 0) return;

    const prevIndex = currentQuestionIndex - 1;

    // Restore the saved transcript for the previous question (if any)
    const prevTranscript = transcripts[prevIndex] || '';

    // Trim transcripts to remove the answer for the current question
    setTranscripts(prev => prev.slice(0, Math.max(0, prevIndex)));
    setCurrentTranscript(prevTranscript);
    setCurrentQuestionIndex(prevIndex);
  };

  const analyzePerformance = () => {
    // Save all interview data to localStorage for the dashboard to access
    if (userDetails.userId) {
      sessionStorage.setItem('interviewUserId', userDetails.userId);
      // Also save the full feedback object to localStorage as backup
      const persistedFeedback = {
        ...(aiFeedback || {}),
        domain: selectedDomain || aiFeedback?.domain || ''
      };

      console.log('📝 Saving aiFeedback to localStorage:', persistedFeedback);
      localStorage.setItem('latestInterviewFeedback', JSON.stringify(persistedFeedback));
      console.log('✅ Data saved. localStorage contents:', localStorage.getItem('latestInterviewFeedback'));

      if (!aiFeedback) {
        console.warn('⚠️ aiFeedback is null/undefined! Persisted fallback object has only domain and minimal data.');
        console.log('Current interview state:', {
          transcripts,
          selectedDomain,
          userDetails,
          finalScore
        });
      }
    }

    // Navigate to the AI Feedback Dashboard with route state to avoid missing data on first render
    console.log('🚀 Navigating to /interview-feedback with route state');
    const cachedFeedback = JSON.parse(localStorage.getItem('latestInterviewFeedback') || 'null');
    const feedbackToPass = aiFeedback ? { ...aiFeedback, domain: selectedDomain || aiFeedback?.domain } : cachedFeedback;
    navigate('/interview-feedback', { state: { feedback: feedbackToPass, domain: selectedDomain || feedbackToPass?.domain } });
  };

  const testAI = async () => {
    setAiTestResult('Checking...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/mock-interview-feedback/test-ai`);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body}`);
      }
      const json = await res.json();
      setAiTestResult(JSON.stringify(json));
    } catch (err) {
      setAiTestResult('Error: ' + (err.message || String(err)));
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [stream]);

  // Poll backend for feedback if interview is complete but aiFeedback not yet available
  useEffect(() => {
    let intervalId = null;
    const poll = async () => {
      if (!userDetails.userId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/mock-interview-feedback/${userDetails.userId}`, { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          if (json.feedback) {
            console.log('🔁 [POLL] Feedback now available from backend, setting aiFeedback');
            setAiFeedback(json.feedback);
            setPollingFeedback(false);
            if (intervalId) clearInterval(intervalId);
          }
        }
      } catch (err) {
        // ignore transient errors while polling
        console.warn('🔁 [POLL] Poll error:', err.message);
      }
    };

    if (interviewComplete && !aiFeedback && userDetails.userId) {
      setPollingFeedback(true);
      // poll immediately then every 3s
      poll();
      intervalId = setInterval(poll, 3000);
    }

    return () => { if (intervalId) clearInterval(intervalId); };
  }, [interviewComplete, aiFeedback, userDetails.userId]);

  // Auto-start interview when domain is selected
  useEffect(() => {
    if (selectedDomain && !interviewStarted && !showUserForm) {
      // Add a small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        startInterview();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDomain, showUserForm]);

  useEffect(() => {
    // Face-api models loading commented out due to CDN issues; blink detection disabled
    // const loadModels = async () => {
    //   try {
    //     await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights/');
    //     await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights/');
    //     setModelsLoaded(true);
    //   } catch (err) {
    //     console.error('Error loading face-api models:', err);
    //   }
    // };
    // loadModels();
  }, []);

  // Generate dynamic feedback based on score and transcript analysis
  const generateDynamicFeedback = (score, transcripts, domain, questionScores) => {
    const summary = score >= 80 
      ? `🌟 Excellent performance! You scored ${score.toFixed(1)}/100 on your ${domain} interview. Your deep understanding and comprehensive answers demonstrate strong domain knowledge.`
      : score >= 60
      ? `👍 Good job! You scored ${score.toFixed(1)}/100 on your ${domain} interview. Your answers cover key concepts, but there's room for improvement with more technical depth.`
      : score >= 40
      ? `📚 Fair performance. You scored ${score.toFixed(1)}/100 on your ${domain} interview. Focus on studying the core concepts and providing more detailed explanations.`
      : `💪 Keep practicing! You scored ${score.toFixed(1)}/100 on your ${domain} interview. Review the key concepts and practice applying them to your answers.`;

    // Analyze which questions scored well
    const strongQuestions = questionScores
      .map((q, idx) => ({ score: q, index: idx }))
      .filter(q => q.score >= 7)
      .map(q => q.index);

    const weakQuestions = questionScores
      .map((q, idx) => ({ score: q, index: idx }))
      .filter(q => q.score < 5)
      .map(q => q.index);

    // Generate dynamic strengths based on strong answers
    const strengths = [];
    if (strongQuestions.length > 0) {
      const keywordsUsed = interviewAnswersByDomain[domain]
        ?.filter((_, idx) => strongQuestions.includes(idx))
        .flat()
        .slice(0, 3)
        .join(', ');
      if (keywordsUsed) {
        strengths.push(`✅ Strong grasp of ${keywordsUsed}`);
      }
    }
    if (transcripts.filter(t => t?.length > 100).length >= transcripts.length / 2) {
      strengths.push('✅ Provided detailed and comprehensive answers');
    }
    if (score >= 70) {
      strengths.push(`✅ Demonstrated solid understanding of ${domain} concepts`);
    }
    if (strengths.length === 0) {
      strengths.push('✅ Completed the interview with effort', '✅ Gained valuable practice experience');
    }

    // Generate dynamic improvements based on weak answers
    const improvements = [];
    if (weakQuestions.length > 0) {
      const weakKeywords = interviewAnswersByDomain[domain]
        ?.filter((_, idx) => weakQuestions.includes(idx))
        .flat()
        .slice(0, 2)
        .join(', ');
      if (weakKeywords) {
        improvements.push(`→ Study and practice: ${weakKeywords}`);
      }
    }
    if (transcripts.some(t => !t || t.trim().length < 20)) {
      improvements.push('→ Provide more detailed and comprehensive answers');
    }
    if (score < 60) {
      improvements.push(`→ Review core ${domain} concepts and fundamentals`);
    }
    if (transcripts.some(t => t && !t.includes(' '))) {
      improvements.push('→ Practice expressing concepts in complete sentences');
    }
    if (improvements.length === 0) {
      improvements.push('→ Explore advanced topics and edge cases', '→ Practice explaining concepts with real-world examples');
    }

    return { summary, strengths, improvements };
  };

  // Renders the results screen after the interview
  if (interviewComplete && finalScore !== null) {
    // Normalize AI feedback shape - support both { analysis: { ai_feedback: {...} } } and legacy { ai_feedback: {...} }
    const normalizedAi = aiFeedback?.analysis?.ai_feedback || aiFeedback?.ai_feedback || aiFeedback || null;

    // Generate dynamic feedback if no AI feedback from backend
    const dynamicFeedback = generateDynamicFeedback(finalScore, transcripts, selectedDomain, questionScores);

    // Get AI feedback if available, fallback to dynamic feedback
    const aiSummary = normalizedAi?.summary || aiFeedback?.summary || dynamicFeedback.summary;
    const aiStrengths = normalizedAi?.strengths || aiFeedback?.strengths || dynamicFeedback.strengths;
    const aiImprovements = normalizedAi?.improvements || aiFeedback?.improvements || dynamicFeedback.improvements;
    
    // Determine score rating
    let scoreRating = '📚 Keep Learning!';
    let scoreColor = 'text-orange-600';
    if (finalScore >= 80) {
      scoreRating = '🌟 Excellent!';
      scoreColor = 'text-green-600';
    } else if (finalScore >= 60) {
      scoreRating = '👍 Good Job!';
      scoreColor = 'text-blue-600';
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900">Interview Complete! 🎉</h1>
            <p className="text-gray-600 mt-2 text-lg">Here is your real-time performance analysis</p>
          </div>

          {/* Overall Score Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8 text-center text-white">
            <p className="text-xl font-semibold mb-2">Your Overall Score</p>
            <p className={`text-7xl font-bold mb-3 ${scoreColor === 'text-green-600' ? 'text-white' : ''}`}>{finalScore.toFixed(1)}/100</p>
            <p className={`text-2xl font-bold ${scoreColor}`}>{scoreRating}</p>
            <p className="text-blue-100 mt-3 text-sm">{aiSummary}</p>
          </div>

          {/* AI Feedback Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <Star size={24} className="text-green-600" />
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {aiStrengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-3 font-bold">✓</span>
                    <span className="font-medium">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-orange-600" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {aiImprovements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-orange-600 mr-3 font-bold">→</span>
                    <span className="font-medium">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-by-Question Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Question-by-Question Analysis</h3>
            <div className="space-y-6">
              {activeQuestions.map((question, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-semibold mb-1">Question {index + 1}</p>
                      <p className="font-bold text-gray-900 text-lg">{question}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-3xl font-bold text-blue-600">{questionScores[index] || 0}</p>
                      <p className="text-xs text-gray-500">/10</p>
                    </div>
                  </div>
                  
                  {/* User's Answer */}
                  <div className="my-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-xs text-gray-600 font-semibold">Your Answer:</p>
                    <p className="text-gray-700 italic mt-1">"{transcripts[index] || 'No answer recorded'}"</p>
                  </div>

                  {/* Expected Keywords */}
                  {interviewAnswersByDomain[selectedDomain]?.[index] && (
                    <div className="my-2 p-2 bg-purple-50 rounded-md">
                      <p className="text-xs text-gray-600 font-semibold">Key Points Covered:</p>
                      <p className="text-sm text-gray-700 mt-1 flex flex-wrap gap-2">
                        {interviewAnswersByDomain[selectedDomain][index].map((keyword, kidx) => (
                          <span key={kidx} className="bg-purple-200 text-purple-900 px-2 py-1 rounded text-xs font-medium">
                            {keyword}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}

                  {/* YouTube Learning Link */}
                  <div className="mt-3">
                    <a
                      href={youtubeUrlsByDomain[selectedDomain]?.[index] || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <span>▶</span>
                      Watch YouTube Tutorial
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debug Info Section */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-xs font-mono border border-gray-300">
            <div className="text-gray-700">
              <div><strong>🔍 Debug Info:</strong></div>
              <div className="mt-2 space-y-1">
                <div>User ID: {userDetails.userId || 'NOT SET'}</div>
                <div>Domain: {selectedDomain}</div>
                <div>Final Score: {finalScore !== null && finalScore !== undefined ? finalScore.toFixed(1) : 'NOT SET'}</div>
                <div>AI Feedback Status: {normalizedAi ? '✅ READY' : (aiFeedback ? '✅ READY (legacy)' : '❌ NOT READY')}</div>
                { (normalizedAi || aiFeedback) && (
                  <>
                    <div>Has analysis.ai_feedback: {normalizedAi ? '✅' : (aiFeedback?.ai_feedback ? '✅ (legacy)' : '❌')}</div>
                    <div>Strengths count: {normalizedAi?.strengths?.length || aiFeedback?.ai_feedback?.strengths?.length || aiFeedback?.strengths?.length || 0}</div>
                  </>
                )}
                <div className="mt-2 text-gray-600">
                  {aiFeedback ? (
                    <span className="text-green-700">✅ Ready to view analytics!</span>
                  ) : (
                    <span className="text-orange-700">
                      {pollingFeedback ? '⏳ Waiting for backend analysis... (auto-polling)' : '⏳ Waiting for backend analysis...'}
                    </span>
                  )}
                </div>
                {/* Quick OpenAI test button */}
                <div className="mt-2">
                  <button
                    onClick={testAI}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium mr-2"
                  >
                    Test OpenAI
                  </button>
                  {aiTestResult && (
                    <div className="mt-2 text-xs font-mono text-gray-700 break-words">{aiTestResult}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={analyzePerformance}
              disabled={!aiFeedback}
              className={`px-8 py-3 ${aiFeedback ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-200 cursor-not-allowed'} text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg shadow-md`}
            >
              <span>📊</span>
              {aiFeedback ? 'View Detailed Analytics' : (pollingFeedback ? 'Waiting for analysis...' : 'Analysis pending')}
            </button>
            <button
              onClick={() => {
                setInterviewComplete(false);
                setShowUserForm(true);
                setFinalScore(null);
                setSelectedDomain('');
                setTranscripts([]);
                setCurrentTranscript('');
                setCurrentQuestionIndex(0);
                setAiFeedback(null);
              }}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg shadow-md"
            >
              <span>🔄</span>
              Try Another Domain
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User details form
  if (showUserForm) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome to Mock Interview</h1>
          <p className="text-center text-gray-500 mb-6">Please provide your details to get started.</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (userDetails.name && userDetails.email && userDetails.userId && userDetails.domain) {
              setSelectedDomain(userDetails.domain);
              setShowUserForm(false);
            } else {
              setError("Please fill in all fields.");
            }
          }}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={userDetails.name}
                onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={userDetails.email}
                onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userDetails.userId}
                onChange={(e) => setUserDetails(prev => ({ ...prev, userId: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your unique user ID"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                Interview Domain
              </label>
              <select
                id="domain"
                value={userDetails.domain}
                onChange={(e) => setUserDetails(prev => ({ ...prev, domain: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a domain...</option>
                {Object.keys(interviewQuestionsByDomain).map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-center text-red-500 mb-4 flex items-center justify-center gap-2">
                <AlertTriangle size={20} /> {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Mock Interview
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Renders the main interview screen
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
      {showCheatingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">Cheating Detected!</h2>
            <p className="text-gray-700 mb-4">Blinking has been detected, which may indicate cheating.</p>
            <button onClick={() => setShowCheatingPopup(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Close</button>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800">Mock Interview Preparation</h1>
        <p className="text-gray-600 mt-2">Answer the following questions to the best of your ability. Your responses will be recorded and analyzed.</p>

        {/* Interview Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-4 rounded">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 How to Use This Interview:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ <strong>Type or Speak</strong> your answer to each question in the text box</li>
            <li>✅ <strong>Click "Next Question"</strong> after answering (don't just skip ahead)</li>
            <li>✅ <strong>Answer ALL questions</strong> before clicking "End Interview"</li>
            <li>⚠️ If you skip typing/speaking, your answer will be recorded as empty</li>
            <li>📊 Your score is based on keywords matched in your actual responses</li>
          </ul>
        </div>
        {!interviewStarted ? (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-gray-700 mb-4">Initializing interview for domain: <strong>{selectedDomain}</strong></p>
            <p className="text-sm text-gray-600">Starting camera and microphone...</p>
          </div>
        ) : activeQuestions.length === 0 ? (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-gray-700">No questions found for domain: <strong>{selectedDomain}</strong></p>
            <p className="text-sm text-gray-600 mt-2">Please go back and select a valid domain.</p>
            <button
              onClick={() => {
                setShowUserForm(true);
                setInterviewStarted(false);
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Domain Selection
            </button>
          </div>
        ) : (
          <>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Question {currentQuestionIndex + 1} of {activeQuestions.length}</h3>
              <p className="text-gray-600 mt-2">{activeQuestions[currentQuestionIndex] || 'No question available'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Your Transcript</h3>
              <p className="text-gray-600 mt-2 mb-2">{currentTranscript || 'Type your answer here or speak if your device supports it.'}</p>
              
              {/* Text input - always available */}
              <div className="mt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {speechRecognitionFailed ? '✍️ Type Your Answer:' : 'Answer (speech or text):'}
                </label>
                <textarea
                  value={currentTranscript}
                  onChange={(e) => setCurrentTranscript(e.target.value)}
                  placeholder={speechRecognitionFailed ? 
                    "Type your complete answer here. Be as detailed as possible..." : 
                    "Your speech will appear here, or type if speech is not working..."}
                  className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                    speechRecognitionFailed 
                      ? 'border-orange-300 focus:ring-orange-400 bg-orange-50' 
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                  rows={4}
                  autoFocus={speechRecognitionFailed}
                />
              </div>
              {speechRecognitionFailed && (
                <p className="text-orange-600 text-xs mt-2">💡 Characters entered: {currentTranscript.length}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePreviousQuestion}
                className="px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                <ArrowLeftCircle size={20} className="inline mr-2" /> Previous
              </button>

              <button
                onClick={handleNextQuestion}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                <ArrowRightCircle size={20} className="inline mr-2" /> Next Question
              </button>

              <button
                onClick={stopInterview}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                <PhoneOff size={20} className="inline mr-2" /> End Interview
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Camera size={20} /> Camera Feed</h3>
              <video ref={videoRef} autoPlay muted className="w-full h-64 bg-gray-200 rounded-lg mt-2" style={{display: stream ? 'block' : 'none'}}></video>
              {!stream && (
                <div className="w-full h-64 bg-gray-200 rounded-lg mt-2 flex items-center justify-center">
                  <p className="text-gray-500">Camera not available</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Mic size={20} /> Audio Status</h3>
              <p className="text-gray-600 mt-2">{stream ? 'Recording in progress...' : 'Text input is available for your answer.'}</p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
