import React from 'react'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import MDIIcon from '@mdi/react'
import styled from 'styled-components'
import palette from '../palette'

const Shadow = styled.div`
    width: 100%;
    bottom: 0;
    position: absolute;
    border-bottom: 2px solid #FFFFFFA5;
        //background: linear-gradient(0deg, rgba(0,0,0,.6)0%, rgba(2,0,36,0.25) 17%,rgba(0,0,0,0.1) 29%,rgba(0,212,255,0) 40%);
    box-shadow: 0px -33px 35px -43px inset rgba(0,0,0,1);
` 

const Icon = styled(MDIIcon)`
  width: 25px;
  height: 25px;  
  margin-bottom: -9px
`

export default function HintTheresMore({onClick, isThereMore}) {
    return <Shadow onClick={onClick}>
        <Icon color={palette.primary} size={2} path={isThereMore ? mdiChevronDown : mdiChevronUp}/>
    </Shadow>
}