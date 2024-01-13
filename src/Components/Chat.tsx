import { FC } from 'react'
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ChatHeader from './ChatHeader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';


const Chat: FC = ({}) => {
  return (
    <div>
      <Accordion sx={{
        position: 'fixed',
        right: '32px',
        bottom: '32px',
        borderRadius: 8
        
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon 
            sx={{
              color: "black",
            }}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          
        >
          <ChatHeader/>
        </AccordionSummary>
        <AccordionDetails sx={{
          width: '320px',
          backgroundColor: 'white',
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <div className='flex flex-col h-80 '>
            <ChatMessages className='px-1 py-2 flex-1'/>
            <ChatInput className='px-3'/>
          </div>
        </AccordionDetails>
      </Accordion>

    </div>)
}

export default Chat