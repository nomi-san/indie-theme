// refresh-reload

import './styles/layout.css'
import './styles/navbar.css'
import './styles/sidebar.css'
import './styles/lobby.css'
import './styles/postgame.css'

import { watchElement } from './utils'

function toggleSocial() {
    let pane = document.querySelector('.lol-social-lower-pane-container')
    if (pane != null) {
        pane.classList.toggle('hidden')
        const hidden = pane.classList.contains('hidden')
        // @ts-ignore
        window.DataStore?.set('__social_hidden', hidden)
    }
}

function load() {
    watchElement<HTMLDivElement>('.bug-report-button')
        .then(el => {
            let clone = el.cloneNode(true) as HTMLDivElement
            el.style.display = 'none'
            el.parentNode?.appendChild(clone)

            clone.removeAttribute('disabled')
            clone.addEventListener('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                toggleSocial()
            }, true)

            Object.defineProperty(clone, 'disabled', {
                value: undefined,
                writable: false,
            })
        })

    watchElement<HTMLDivElement>('.lol-social-lower-pane-container')
        .then(el => {
            // @ts-ignore
            const hidden = window.DataStore?.get('__social_hidden', false)
            if (hidden === true) {
                el.classList.add('hidden')
            }
        })

    // watchElement('.rcp-fe-viewport-persistent')
    //     .then(el => {
    //         console.log('.rcp-fe-viewport-persistent created')
    //         let mo = new MutationObserver(mutations => {
    //             mutations.forEach(mutation => {
    //                 mutation.addedNodes.forEach(node => {
    //                     if (node.nodeName === 'IFRAME') {
    //                         /** @type {HTMLIFrameElement} */
    //                         // todo
    //                     }
    //                 })
    //             })
    //         })
    //         mo.observe(el, {
    //             childList: true,
    //             subtree: true
    //         })
    //     })

    // // inject theme
    // let theme = new URL('./theme.css', import.meta.url).href
    // let link = document.createElement('link')
    // link.setAttribute('rel', 'stylesheet')
    // link.setAttribute('href', theme)
    // document.body.appendChild(link)
}

document.addEventListener('DOMContentLoaded', load)