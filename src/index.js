async function delay(t) {
    return new Promise(r => setTimeout(r, t))
}

function toggleSocial() {
    /** @type {HTMLDivElement} */
    let pane = document.querySelector('.lol-social-lower-pane-container')
    if (pane != null) {
        pane.classList.toggle('hidden')
        window.DataStore?.set('__social_hidden', pane.classList.contains('hidden'))
    }
}

/** @returns {Promise<HTMLElement>} */
function watchElement(selector, interval = 500) {
    return new Promise(async resolve => {
        while (true) {
            let el = document.querySelector(selector)
            if (el != null) {
                resolve(el)
                break
            }
            await delay(interval)
        }
    })
}

export async function load() {
    watchElement('.bug-report-button')
        .then(el => {
            let clone = el.cloneNode(true)
            el.style.display = 'none'
            el.parentNode.appendChild(clone)
            clone.addEventListener('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                toggleSocial()
            }, true)
        })

    watchElement('.lol-social-lower-pane-container')
        .then(el => {
            let hidden = window.DataStore?.get('__social_hidden', false)
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

    // inject theme
    let theme = new URL('./theme.css', import.meta.url).href
    let link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', theme);
    document.body.appendChild(link)
}