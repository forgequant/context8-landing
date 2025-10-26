import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { CodeBlock } from './CodeBlock'
import { CodeExample } from '@/data'

interface CodeTabsProps {
  examples: CodeExample[]
}

export function CodeTabs({ examples }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {examples.map((example, index) => (
          <button
            key={example.id}
            onClick={() => setActiveTab(index)}
            className={cn(
              'px-4 py-2 font-mono text-sm transition-all duration-200 whitespace-nowrap border-b-2',
              activeTab === index
                ? 'text-terminal-cyan border-terminal-cyan'
                : 'text-terminal-muted border-transparent hover:text-terminal-text hover:border-graphite-700'
            )}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {examples[activeTab] && (
            <div className="space-y-4">
              <p className="text-terminal-muted">
                {examples[activeTab].description}
              </p>
              <CodeBlock
                code={examples[activeTab].code}
                language={examples[activeTab].language}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
