import _ from 'lodash'
export const nameToMetaPieces = _.memoize(nameToMetaPieces_)

function nameToMetaPieces_(name, maxLength = 24) {
    if (!name) return []

    function ellipseIfNecessary(text) {
        const _pieces = []
        if (text.length > maxLength) {
            _pieces.push({ value: '[...]', meta: 'ellipsis' })
            _pieces.push({ value: text.slice(text.length - maxLength + 10), meta: 'body' })
        } else {
            _pieces.push({ value: text, meta: 'body' })
        }
        return _pieces
    }

    const pieces = []
    if (name.startsWith('sha256')) {
        let [sha, remaining] = name.split('sha256:')
        pieces.push({ value: 'sha256', meta: 'type' })
        if (remaining.includes(':')) {
            let [body, version] = remaining.split(':')
            pieces.push(...ellipseIfNecessary(body))
            pieces.push({ value: version, meta: 'version' })
        } else {
            pieces.push(...ellipseIfNecessary(remaining))
        }
    } else if (name.startsWith(process.env.REACT_APP_REPO_ORIGIN)) {
        pieces.push({ value: 'repo', meta: 'type' })
        let [repo, remaining] = name.split(process.env.REACT_APP_REPO_ORIGIN)
        if (remaining?.includes(':')) {
            let [body, version] = remaining.split(':')
            pieces.push(...ellipseIfNecessary(body))
            pieces.push({ value: version, meta: 'version' })
        } else {
            pieces.push(...ellipseIfNecessary(remaining))
        }
    } else pieces.push(...ellipseIfNecessary(name))


    return pieces
}


export const blendColors = (c0, c1, p) => { //https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    let f = parseInt(c0.slice(1), 16), t = parseInt(c1.slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF,
      B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF
    return '#' + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1)
}

export function getContainerStatus(containerData) {
    return containerData?.State?.Status
}

// console.log({ test1: nameToMetaPieces('ciao') })
//console.log({ test1: nameToMetaPieces(undefined) })
// console.log({ test1: nameToMetaPieces('repo.telematicainformatica.com:4329/bridging-it/sensors:rs485_latest') })
// console.log({ test1: nameToMetaPieces('repo.telematicainformatica.com:4329/bridging-it/sensors') })
// console.log({ test2: nameToMetaPieces('sha256:c303ed88861f168e1d8797c12937f5fe315e15ca6212bddbffca0deb3e26046f') })

