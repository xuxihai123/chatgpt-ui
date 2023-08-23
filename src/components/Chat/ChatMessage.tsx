import { Message } from '@/types';
import {
    IconRobot,
    IconUser,
  } from '@tabler/icons-react';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from '../Markdown/CodeBlock';

interface Props {
    message: Message;
    lightMode: 'light' | 'dark';
}

export const ChatMessage: FC<Props> = ({ message, lightMode }) => {
    return (
        <div
            className={`group ${
                message.role === 'assistant'
                    ? 'text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]'
                    : 'text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-white dark:bg-[#343541]'
            }`}
            style={{ overflowWrap: 'anywhere' }}>
            <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                <div className="min-w-[40px] text-right font-bold">
                {message.role === 'assistant' ? ( <IconRobot color='#0ea47f' size={30} />) : (<IconUser color='#5436da' size={30} />)}
                </div>

                <div className="prose  w-full dark:prose-invert">
                    {message.role === 'user' ? (
                        <div className="prose dark:prose-invert whitespace-pre-wrap">{message.content}</div>
                    ) : (
                        <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeMathjax]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <CodeBlock key={Math.random()} language={match[1]} value={String(children).replace(/\n$/, '')} lightMode={lightMode} {...props} />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                table({ children }) {
                                    return <table className="border-collapse border border-black dark:border-white py-1 px-3">{children}</table>;
                                },
                                th({ children }) {
                                    return <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-white">{children}</th>;
                                },
                                td({ children }) {
                                    return <td className="border border-black dark:border-white break-words py-1 px-3">{children}</td>;
                                }
                            }}>
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};
