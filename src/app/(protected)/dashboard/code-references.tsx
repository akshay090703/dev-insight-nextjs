'use client'
import { Tabs, TabsContent } from '@/components/ui/tabs';
import React, { useState } from 'react'
import { cn } from '../../../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
    fileReferences: {
        fileName: string;
        sourceCode: string;
        summary: string;
    }[]
}

const CodeReferences = ({ fileReferences }: Props) => {
    const [tab, setTab] = useState(fileReferences[0]?.fileName);
    console.log(fileReferences);


    return (
        <div className='max-w-[66vw]'>
            <Tabs value={tab} onValueChange={setTab}>
                <div className="overflow-scroll flex flex-col gap-2 bg-gray-200 p-1 rounded-md">
                    <div className="flex flex-wrap gap-1">
                        {
                            fileReferences.map(file => (
                                <button onClick={() => setTab(file.fileName)} key={file.fileName} className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-white', {
                                    'bg-primary text-primary-foreground': tab === file.fileName
                                })}>
                                    {file.fileName}
                                </button>
                            ))
                        }
                    </div>
                    {
                        fileReferences.map(file => (
                            <TabsContent key={file.fileName} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-7xl rounded-md'>
                                <SyntaxHighlighter language='typescript' style={darcula}>
                                    {file.sourceCode}
                                </SyntaxHighlighter>
                            </TabsContent>
                        ))
                    }
                </div>
            </Tabs>
        </div>
    )
}

export default CodeReferences