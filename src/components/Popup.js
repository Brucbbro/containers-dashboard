import React from 'react'
import styled from 'styled-components'


const History = styled.div`
    background-color: #fff;
    border-radius: 3px;
    padding: 3px;
`

const Container = styled.div`
    background-color: #f6f6f6;
    word-break: break-all;
    padding: 7px;
    border-radius: 5px;
        box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.2);

`

export default function Popup({data=''}) {
    return <Container>
        {data}
        <History>
            <p>History</p>
            <p>No history available yet</p>
            <p>No history available yet</p>
            <p>No history available yet</p>
            <p>No history available yet</p>
        </History>
    </Container>
}