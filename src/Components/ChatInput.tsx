'use client'

import { cn } from '@/lib/utils'
import { CircularProgress, TextField, TextFieldProps } from '@mui/material'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import {useMutation} from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { Message } from '@/lib/validators/message';
import { MessagesContext } from '@/context/messages';
import SendIcon from '@mui/icons-material/Send';
import toast from 'react-hot-toast'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({className, ...props}) => {
    const [input, setInput] = useState<string>('')
    const {messages, addMessage, removeMessage, updateMessage, setIsMessageUpdating} = useContext(MessagesContext)

    const textareaRef = useRef<null | TextFieldProps>(null)
    
    const {mutate: sendMessage, isPending} = useMutation({
        mutationFn: async (message: Message) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({messages : [message]}),
              })
              if(!response.ok){
                throw new Error()
              }

            return response.body
        },


        onMutate(message){
            addMessage(message)
        },

        onSuccess: async (stream) =>{
            if(!stream) throw new Error('No stream found')
            
            const id = nanoid()
            const responseMessage: Message = {
                id,
                isUserMessage:false,
                text: '',
            }

            addMessage(responseMessage)
            setIsMessageUpdating(true)

            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false
            

            while(!done){
                const {value, done:doneReading} = await reader.read()
                done = doneReading

                const chunkValue = decoder.decode(value)
                updateMessage(id, (prev) => prev + chunkValue)   
            }

            //cleanup
            setIsMessageUpdating(false)
            setInput('')

            setTimeout(()=>{
                textareaRef.current?.focused
            },10)
        },
        onError(_, message) {
            toast.error('Something went wrong. Please try again.')
            removeMessage(message.id)
            textareaRef.current?.focused
        },
    })
  return (
    <div {...props} className={cn("border-t border-zinc-400", className)}>
        <div className='relative mt-4 flex items-center justify-end overflow-hiiden rounded-lg border-none outline-none'>
        <TextField 
            inputRef={textareaRef}
            id="multiline-flexible" 
            variant="standard" 
            multiline
            minRows={1} 
            disabled={isPending}
            maxRows={4} 
            autoFocus = {true}
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            onKeyDown={(e) =>{
                if(e.key === 'Enter' && !e.shiftKey){
                    e.preventDefault()

                    const message:Message = {
                        id: nanoid(),
                        isUserMessage: true,
                        text :input
                    }
                    sendMessage(message)
                }
            }}
            InputProps={{disableUnderline: true,}}
            placeholder='Write a message...'
            className='peer disabled:opacity-50 pr-14 pl-2 resize-none block w-full border-none bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'/>

            <div className='absolute inset-y-0 flex py-1.5 pr-1.5'>
                <kbd className='inline-flex items-center rounded  bg-inherit px-1 font-sans text-xs text-gray-400'>
                    {isPending? <CircularProgress size={20}/> : <SendIcon/>}
                </kbd>
            </div>
            <div aria-hidden='true' className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'/>
        
        </div>
    </div>)
}

export default ChatInput