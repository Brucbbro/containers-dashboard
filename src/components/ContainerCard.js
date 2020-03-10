import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { nameToMetaPieces } from '../utils'
import { mdiFileDocument, mdiInformation, mdiStopCircle, mdiTimerSand } from '@mdi/js'
import MDIIcon from '@mdi/react'
import palette from '../palette'
import Tippy from '@tippy.js/react'
import { TippyContext } from '../App'
import 'tippy.js/dist/tippy.css'
import Popup from './Popup'


const Outer = styled.div`
    flex: 0 0 auto;
    margin: 7px;
    height: 90px;
    width: 285px;
    padding: 19px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 3px;
    border: 1px solid;
    border-color: ${props => props.color};
    background-color: #fff;
    //box-shadow: 1px 1px 3px rgba(0,0,0,.2);
`

const Key = styled.span`
  color: dimgray;
  font-weight: 100;
  font-size: 14px;
`

const TypeText = styled.span`
  text-align: left;
  color: #4f4f4f;
  font-size: 14px;
`

const BodyText = styled.span`
  text-align: left;
  color: inherit;
  font-size: 14px;
  font-weight: 500;
`

const VersionText = styled.span`
  text-align: left;
  color: #4f4f4f;
  font-size: 14px;
`

const Text = styled.span`
  text-align: left;
  color: black;
  font-weight: 500;
  font-size: 16px;
`

const MinorText = styled.span`
  color: #6e6e6e;
  text-align: left;
  font-size: 12px;
`

const Right = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`
const Left = styled.div``
const Icon = styled(MDIIcon)`
    margin: 2px;
    width: 22px;
    height: 22px;
`

const Td = styled.td`
    text-align: left;
    padding-right: 1em;
`
const Tr = styled.tr`
`

function FormatText(props) {
    const componentMapping = {
        type: props => <TypeText {...props}/>,
        body: props => <BodyText {...props}/>,
        version: props => <VersionText {...props}/>,
        ellipsis: props => <MinorText {...props}/>,
        undefined: props => <Text {...props}/>
    }

    const [dataTip, setDataTip] = useState(null)
    const tippySingleton = useContext(TippyContext)

    
    let pieces = []
    if (!props.skipFormatting) {
        
    pieces = props.data && nameToMetaPieces(props.data)//Array.isArray(props.data) ? props.data : [{ value: props.data }]
    } else {
        pieces = [props.data]
    }
   
    useEffect(() => {
        let hasEllipsis = false
        for (let piece of pieces) {
            if (piece.meta === 'ellipsis' || piece.meta ==='repo') {
                hasEllipsis = true
                break
            }
        }
        if (hasEllipsis) {
            setDataTip(props.data)
        }
    }, [pieces, props.data])
    return dataTip ?
      <Tippy
        theme={'bootstrap'}
        content={<Popup data={props.data}/>}
        placement='bottom'
        singleton={tippySingleton.value}
      >
        <span title={props.data}>
        {pieces.map((piece, index) => {
            const Component = componentMapping[piece.meta]
            return <Component
              key={index}
              style={{ textAlign: 'left' }}
            >
                {piece.value}
            </Component>
        })}
    </span>
      </Tippy>
      :
      <span title={props.data}>
        {pieces.map((piece, index) => {
            const Component = componentMapping[piece.meta]
            return <Component
              key={index}
              style={{ textAlign: 'left' }}
            >
                {piece.value}
            </Component>
        })}
    </span>
}


export default function ({ data = {}, style = {} }) {
    const colorMapping = {
        exited: palette.error,
        running: palette.ok,
        created: palette.warning,
        undefined: palette.warning,
        up: palette.ok
    }
    const canBeStopped = data.State?.Status === 'running'
    return <Outer color={colorMapping[data.State?.Status]} style={style}>
        <Left>
            <table style={{ height: '100%' }}>
                <tbody>
                <Tr key={'name'}>
                    <Td><Key>name</Key></Td>
                    <Td><FormatText data={data.Name}/></Td>
                </Tr>
                <Tr key={'image'}>
                    <Td><Key>image</Key></Td>
                    <Td><FormatText data={data.Image}/></Td>
                </Tr>
                <Tr key={'status'}>
                    <Td><Key>status</Key></Td>
                    <Td><FormatText data={data.State?.Status}/></Td>
                </Tr>
                <Tr key={'update'}>
                    <Td><Key>update</Key></Td>
                    <Td><FormatText data={'n/a'}/></Td>
                </Tr>
                </tbody>
            </table>
        </Left>
        <Right>
            <Icon path={mdiInformation}/>
            <Icon path={mdiFileDocument}/>
            <Icon path={mdiTimerSand}/>
            {canBeStopped && <Icon color={'red'} path={mdiStopCircle}/>}
        </Right>
    </Outer>

}