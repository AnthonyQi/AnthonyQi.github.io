export interface Project {
  id: string
  title: string
  tags: string[]
  description: string
  status: 'Complete' | 'In Progress'
  githubUrl?: string
  demoUrl?: string
}

export const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Rust Garbage Collection',
    tags: ['Rust', 'VSCode', 'Git', 'Garbage Collection'],
    description:
      'Implemented three garbage collectors in Rust: reference counting, mark-and-sweep, and stop-and-copy, including recursive heap traversal and live-object compaction.',
    status: 'Complete',
  },
  {
    id: '02',
    title: 'OCaml C Compiler',
    tags: ['OCaml', 'VSCode', 'Git', 'Compiler', 'Type-Checking', 'OP-Sem'],
    description:
      'Built a full compiler pipeline in OCaml: lexer, parser, AST evaluator, static type checker, and stack-machine code generator for a SmallC-like language.',
    status: 'Complete',
  },
  {
    id: '03',
    title: 'Unix Shell',
    tags: ['C', 'VSCode', 'Git', 'GDB', 'Valgrind', 'IO ReDirection'],
    description:
      'Built a Unix-style shell from scratch supporting fork/exec, I/O redirection, pipelines, and background processes via wait() and signal handling.',
    status: 'Complete',
  },
  {
    id: '04',
    title: 'Explicit List (EL) Malloc and Matrix Operation Optimization',
    tags: ['C', 'VSCode', 'Git', 'Valgrind', 'GDB', 'Memory Management', 'Optimization'],
    description:
      'Implemented an explicit free list allocator using mmap, with splitting and coalescing for dynamic heap management. Optimized multithreaded matrix multiplication using pthreads, mutex synchronization, and cache-aware blocking to improve memory locality and performance.',
    status: 'Complete',
  },
  {
    id: '05',
    title: 'Minecraft Fabric Mods',
    tags: ['Java', 'VSCode', ],
    description:
      'Built two Minecraft Fabric mods featuring server-side state tracking (boss bar + commands) and custom gameplay mechanics (enchantments, cooldown systems, and textured items).',
    status: 'Complete',
  },
]