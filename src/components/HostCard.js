import React, { useEffect, useRef, useState } from 'react'
import ContainerCard from './ContainerCard'
import styled from 'styled-components'
import { mdiCheckCircle, mdiAlertOutline, mdiCloseCircle } from '@mdi/js'
import Icon from '@mdi/react'
import palette from '../palette'
import { blendColors, getContainerStatus } from '../utils'
import HintTheresMore from './HintTheresMore'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid, FixedSizeList } from 'react-window'


const Outer = styled.div`
    min-height: 350px;
    max-height: ${props => props.shouldHideOverflow ? '350px' : '90vh'};
    flex: 1 0 auto;
    margin-top: 10px;
    border-radius: 5px;
    display: flex;
    border: 0.5px solid rgba(0,0,0,0.09);
    border-bottom: 1px solid rgba(0,0,0,0.3);

    flex-direction: column;
        background-color: #FFFFFFA5;
    overflow: hidden;
    box-shadow: 1px 1px 10px rgba(0,0,0,.2);
    transition: max-height 0.2s ease;
    &:focus {
        outline: none;
    }
`

const Body = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;

`
const Header = styled.div`
    background-color: #F5F6F9;
    color: #3d4450;
    display: flex;
    border-radius: 5px 5px 0 0;
    flex: 0 0 auto;
    height: 30px;
    line-height: 30px;
    padding: 5px 20px;    
    border-bottom: 0.5px solid rgba(0,0,0,0.09);
    flex-direction: row;
    justify-content: space-between;
`
const LightText = styled.span`
    color: #afafaf;
`

const Stats = styled.div`
    padding: 5px;
    max-width: 100px;
    flex: 0 0 auto;
    background-color: transparent;   
    flex-direction: column;
    display: flex;
    justify-content: flex-start;
    align-items: center;     
`

const Content = styled.div`    
    background-color: transparent;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-around;
    flex-wrap: wrap;    
    // overflow: ${props => props.shouldHideOverflow ? 'scroll' : 'visible'};
    height: 100%;
    max-width: 100%;
`

const StyledIcon = styled(Icon)`
    width: 43px;
    height: 43px;
`

function StatLine(props) {
    const { onClick, disabled, desaturate, ...rest } = props
    return <StyledStatLine {...rest} onClick={!disabled && onClick} disabled={disabled} desaturate={desaturate}/>
}

const StyledStatLine = styled.div`
    display: flex;
    align-items: center;
    text-align: left;
    flex-direction: row;
    font-size: 24px;
    border-radius: 0 5px 5px 0;
    padding: 20px 5px;    
    width: 100%;
    opacity: ${props => props.desaturate ? 0.15 : 0.75};
    &:hover {
      opacity: ${props => props.disabled ? 0.15: 1};
      cursor: ${props => props.disabled ? 'initial': 'pointer'};
    }
    // background-color: ${props => props.desaturate ? blendColors(props.color, '#ffffff', 0.8) : 'initial'};
    // border: ${props => props.desaturate ? `1px solid ${props.color}` : 'initial'};
`

function ContainerCardRenderer({ container, style }) {
    return <ContainerCard style={style} key={container.Id} data={container}/>
}

export default function HostCard({ data }) {
    const [hostData, setHostData] = useState({})
    const [containers, setContainersData] = useState([])
    const [runningContainersCount, setRunningCount] = useState(0)
    const [warningContainersCount, setWarningCount] = useState(0)
    const [errorContainersCount, setErrorCount] = useState(0)
    const [shouldHideOverflow, setShouldHideOverflow] = useState(true)
    const [containersToDisplay, setContainersToDisplay] = useState(containers)
    const [isViewFiltered, setIsViewFiltered] = useState(undefined)
    const [isThereHiddenContent, setIsThereHiddenContent] = useState(false)

    const currentElement = useRef(null)
    const contentRef = useRef(null)


    function filterContainers({ match, exclude, button }) {
        if (isViewFiltered && isViewFiltered === button) {
            setIsViewFiltered(undefined)
            return setContainersToDisplay(containers)
        } else {
            setIsViewFiltered(button)
            return setContainersToDisplay(containers.filter(container => {
                if (match) {
                    return match.includes(getContainerStatus(container))
                } else if (exclude) {
                    return !exclude.includes(getContainerStatus(container))
                }
                return container
            }))
        }
    }

    useEffect(() => {
        console.warn('useffect hostCard')
        const [host, ...containers] = data
        let elementToClean = currentElement.current
        setHostData(host)
        setContainersData(containers)
        setContainersToDisplay(containers)
        const containerStatuses = { ok: 0, warning: 0, error: 0 }
        for (let container of containers) {
            if (getContainerStatus(container) === 'running') {
                containerStatuses.ok += 1
            } else if (getContainerStatus(container) === 'exited') {
                containerStatuses.error += 1
            } else {
                containerStatuses.warning += 1
            }
        }
        setErrorCount(containerStatuses.error)
        setRunningCount(containerStatuses.ok)
        setWarningCount(containerStatuses.warning)


        return () => {
            document.removeEventListener('keyup', hideOverflowOnEsc)
            elementToClean.removeEventListener('blur', hideOverflow)
        }
    }, [data])

    const toggleOnlyOk = () => filterContainers({ match: ['running'], button: 'ok' })
    const toggleOnlyWarning = () => filterContainers({ exclude: ['running', 'exited'], button: 'warning' })
    const toggleOnlyError = () => filterContainers({ match: ['exited'], button: 'error' })
    const hideOverflow = () => setShouldHideOverflow(true)
    const hideOverflowOnEsc = (evt) => {
        if (evt?.key === 'Escape' || evt?.key === 'Esc' || evt.keyCode === 27) {
            if (shouldHideOverflow) {
                hideOverflow()
            }
        }
    }
    const toggleOverflow = () => {
        currentElement.current.addEventListener('blur', hideOverflow)
        document.addEventListener('keyup', hideOverflowOnEsc)
        setShouldHideOverflow(false)
    }

    useEffect(() => {
        if (contentRef.current) { // align what's rendered with scroll/height
            const isHidden = contentRef.current.scrollHeight !== contentRef.current.offsetHeight
            if (isHidden !== isThereHiddenContent) {
                setIsThereHiddenContent(isHidden)
            }
        }
    }, [containersToDisplay.length])

    const lastUpdate = undefined
    return <Outer shouldHideOverflow={shouldHideOverflow} ref={currentElement} tabIndex={0}>
        <Header><span>TRACKING TAG: {hostData.Name || 'host'}</span><LightText>Updated: {lastUpdate || 'n/a'}</LightText></Header>
        <Body>
            <Stats>
                <StatLine
                  key={'ok-stat'}
                  color={palette.ok}
                  disabled={!runningContainersCount}
                  onClick={toggleOnlyOk}
                  desaturate={isViewFiltered && isViewFiltered !== 'ok'}>
                    <StyledIcon color={palette.ok} path={mdiCheckCircle}/>
                    <span>{runningContainersCount}</span>
                </StatLine>
                <StatLine
                  key={'warn-stat'}
                  color={palette.warning}
                  disabled={!warningContainersCount}
                  onClick={toggleOnlyWarning}
                  desaturate={isViewFiltered && isViewFiltered !== 'warning'}>
                    <StyledIcon color={palette.warning} path={mdiAlertOutline}/>
                    <span>{warningContainersCount}</span>
                </StatLine>
                <StatLine
                  key={'error-stat'}
                  disabled={!errorContainersCount}
                  color={palette.error}
                  onClick={toggleOnlyError}
                  desaturate={isViewFiltered && isViewFiltered !== 'error'}>
                    <StyledIcon color={palette.error} path={mdiCloseCircle}/>
                    <span>{errorContainersCount}</span>
                </StatLine>
            </Stats>
            <div style={{ position: 'relative', flex: 1 }}>
                <Content
                  shouldHideOverflow
                  ref={contentRef}
                  style={{
                      overflow: shouldHideOverflow ? 'hidden' : 'scroll',
                      justifyContent: 'space-around'
                  }}
                >
                    {/*TODO:  To use a virtualized list need to implement search or user won't be able to use browser search*/}
                    {/*<div style={{ flex: '1 1 auto' }}>*/}
                    {/*    {data && <AutoSizer>*/}
                    {/*        {({ width, height }) => console.log({ width, height }) || <FixedSizeGrid*/}
                    {/*          columnCount={Math.floor(width / 325)}*/}
                    {/*          columnWidth={325}*/}
                    {/*          height={height}*/}
                    {/*          rowCount={containersToDisplay.length / 3}*/}
                    {/*          rowHeight={170}*/}
                    {/*          width={width}*/}
                    {/*          style={{ backgroundColor: 'pink' }}*/}
                    {/*          itemData={containersToDisplay}*/}
                    {/*        >*/}
                    {/*            {({ style, columnIndex, data, rowIndex }) => {*/}
                    {/*                // const container = data[rowIndex][columnIndex] // not working since data is kept flat for some reason*/}
                    {/*                const container = data[rowIndex * Math.floor(width / 325) + columnIndex]*/}
                    {/*                return container ? console.log('container!') ||<ContainerCardRenderer style={style} container={container}/> :*/}
                    {/*                  console.log(' no container :(') ||<span>no container</span>*/}
                    {/*            }}*/}
                    {/*        </FixedSizeGrid>}*/}
                    {/*    </AutoSizer>*/}
                    {/*    }*/}
                    {/*</div>*/}

                    {containersToDisplay.map(container => <ContainerCardRenderer key={container.Id}
                                                                                 container={container}/>)}
                </Content>
                {shouldHideOverflow && isThereHiddenContent && <HintTheresMore
                  isThereMore={isThereHiddenContent}
                  onClick={toggleOverflow}/>}
            </div>
        </Body>
    </Outer>

}