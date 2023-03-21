(function() {
    document.onmouseover = document.onmouseout = main
    document.onkeydown = target

    let elem
    let key
    let targets = []
    let click = true
    let mouseX
    let mouseY
    let styles
    let rect

    function main(e) {
        const $this = e.target
        if(!$this.closest('.doc') && !['page', 'main'].includes($this.getAttribute('class'))) {
            if (e.type === 'mouseover' ) {
                elem = $this
                styles = window.getComputedStyle(elem, null)
                rect = elem.getBoundingClientRect()

                hover()
                if (targets.length !== 2) createTablet('rgb(71, 71, 71)')
                if (styles.padding !== '0px' && targets.length !== 2) padding()
                if (styles.display === 'flex') flex()
                if (styles.display === 'grid') grid()
            } else {
                if (targets.length !== 2) removeTablet()
                removeHover()
                removeAfter()
                removeEditTablet()
            }
        }
    }

    function hover() {
        if (!targets.includes(elem) && targets.length !== 2) {
            const border = document.createElement('div')
            border.setAttribute('id', 'orange')
            Object.assign(border.style, {
                'width': `${elem.clientWidth}px`,
                'height': `${elem.clientHeight}px`,
                'position': 'absolute',
                'left':  `${window.pageXOffset + rect.left}px`,
                'top':  `${window.pageYOffset + rect.top}px`,
                'pointer-events': 'none',
                'border': '3px solid orange',
                'z-index': '1002',
            })
            document.body.appendChild(border)
        } 
    }

    function removeHover() {
        const border = document.querySelector('#orange')
        if (border) border.remove()
    }

    function createTablet(color) {
        const div = document.createElement('div')
        new Promise((resolve, reject) => {
            resolve(
                Object.assign(div.style, {
                    'background-color': `${color}`,
                    'position': 'absolute',
                    'color': 'white',
                    'font-family': 'Montserrat',
                    'display': 'flex',
                    'flex-direction': 'column',
                    'align-items': 'flex-start',
                    'border-radius': '10px',
                    'padding': '10px',
                    'border': '1px solid white',
                    'z-index': '1003',
                    'pointer-events': 'none',
                    'left': `${mouseX}px`,
                    'top': `${mouseY}px`,
                }),
                div.setAttribute('id', 'tablet'),
                div.innerHTML = `${
                    targets.length !== 2 ?
                    `
                    <div style="margin-left: auto;">${elem.clientWidth} x ${elem.clientHeight}</div>
                    <div style="margin-left: auto;">${styles.fontFamily}</div>
                    <div style="margin-left: auto;">${styles.fontSize}</div>
                    <div style="color: rgb(250, 219, 137);">${elem.getAttribute('class') ? `.${elem.getAttribute('class')}` : ''}</div>
                    <br>
                    <div style="color: rgb(122, 255, 167);">${styles.padding !== '0px' ? `padding: ${styles.padding}` : ''}</div>
                    <div style="color: rgb(122, 255, 167);">${styles.margin !== '0px' ? `margin: ${styles.margin}` : ''}</div>
                    <div style="color: rgb(255, 130, 130);">${styles.display === 'flex' ? `display: ${styles.display}` : ''}</div>
                    <div style="color: rgb(255, 130, 130);">${styles.flexDirection === 'column' ? `flex-direction: ${styles.flexDirection}` : ''}</div>
                    <div style="color: rgb(255, 130, 130);">${styles.justifyContent !== 'normal' ? `justify-content: ${styles.justifyContent}` : ''}</div>
                    <div style="color: rgb(195, 135, 255);">${styles.display === 'grid' ? `display: ${styles.display}` : ''}</div>
                    <div style="color: rgb(195, 135, 255);">${styles.gridTemplateColumns !== 'none' ? `grid-template-columns: ${styles.gridTemplateColumns}` : ''}</div>
                    <div style="color: rgb(195, 135, 255);">${styles.justifySelf !== 'auto' ? `justify-self: ${styles.justifySelf}` : ''}</div>
                    <div style="color: rgb(195, 135, 255);">${styles.alignSelf !== 'auto' ? `align-self: ${styles.alignSelf}` : ''}</div>
                    <div style="${styles.display === 'grid' ? "color: rgb(195, 135, 255)" : "color: rgb(255, 130, 130)"};">${styles.gap !== 'normal' ? `gap: ${styles.gap}` : ''}</div>
                    `
                    :
                    `
                    <div>${targetsPos()}</div>
                    `
                }`,
                document.body.appendChild(div),
            )
        })
        .then(() => {
            tabletPos()
        })
    }

    function tabletPos() {
        const tablet = document.getElementById('tablet')
        const editTablet = document.getElementById('edit-tablet')
        window.addEventListener('mousemove', (e) => {
            Object.assign(tablet.style, {
                'left': `${e.pageX + 30}px`,
                'top': `${e.pageY}px`,
            })
            mouseX = e.pageX + 30
            mouseY = e.pageY - 20

            if (editTablet) {
                Object.assign(editTablet.style, {
                    'left': `${e.pageX - 225}px`,
                    'top': `${e.pageY}px`,
                })
            }
        })
    }

    function removeTablet() {
        const tablets = document.querySelectorAll('#tablet')
        if (tablets) {
            for (let item of tablets) {
                item.remove()
            }
        }
    }

    function target(e) {
        if (e.key === 'z' && click) {
            targets.push(elem)
            elem.style.outline = '3px solid red',
            elem.setAttribute('id', 'red')
            key = e.key
            if(targets.length > 2) targets = []
            if (targets.length == 2) {
                click = false
                removeTablet()
            }
        }
        if (e.key === 'c' && !document.getElementById('edit-tablet')) {
            for (let item of targets) {
                item.removeAttribute('style')
                item.removeAttribute('id')
            }
            removeTablet()
            removeAfter()
            click = true
            targets = []
        } 
        if (e.key === 'd' && targets.length === 2) {
            key = e.key
            createTablet('red')
            targetsPos()
        } 
        if (e.key === 'w' && targets.length === 2) {
            key = e.key
            createTablet('red')
            targetsPos()
        } 
        if (e.key === 'r' && !document.getElementById('edit-tablet')) {
            setTimeout(() => {
                editTablet()
                tabletPos()
            }, 1)
        }
        if (e.key === 'Control') {
            const textarea = document.getElementById('edit-tablet').firstChild
            elem.setAttribute('style', `${textarea.value}`)
        }
    }

    function targetsPos() {
        let arr = []
        if (key === 'd') {
            if (targets[0].offsetLeft < targets[1].offsetLeft) {
                arr.push(targets[0].getBoundingClientRect().right)
                arr.push(targets[1].getBoundingClientRect().left)
    
                return `x : ${Math.max.apply(null, arr) - Math.min.apply(null, arr)}px`
            }
            if (targets[0].offsetLeft > targets[1].offsetLeft) {
                arr.push(targets[0].getBoundingClientRect().left)
                arr.push(targets[1].getBoundingClientRect().right)
    
                return `x : ${Math.max.apply(null, arr) - Math.min.apply(null, arr)}px`
            }
        }
        if (key === 'w') {
            if (targets[0].offsetTop < targets[1].offsetTop) {
                arr.push(targets[0].getBoundingClientRect().bottom)
                arr.push(targets[1].getBoundingClientRect().top)
    
                return `y : ${Math.max.apply(null, arr) - Math.min.apply(null, arr)}px`
            }
            if (targets[0].offsetTop > targets[1].offsetTop) {
                arr.push(targets[0].getBoundingClientRect().top)
                arr.push(targets[1].getBoundingClientRect().bottom)
    
                return `y : ${Math.max.apply(null, arr) - Math.min.apply(null, arr)}px`
            }
        }
    }

    function removeAfter() {
        const elems = document.querySelectorAll('#padding, #grid, #flex')
        for (let item of elems) {
            item.remove()
        }
    }

    function padding() {
        const padding = document.createElement('div')
        const div = document.createElement('div')
        padding.setAttribute('id', 'padding')
        Object.assign(padding.style, {
            'width': `${elem.clientWidth}px`,
            'height': `${elem.clientHeight}px`,
            'position': 'absolute',
            'left':  `${window.pageXOffset + rect.left}px`,
            'top':  `${window.pageYOffset + rect.top}px`,
            'pointer-events': 'none',
            'border': 'solid rgb(122, 255, 167, 0.53)',
            'z-index': '1001',
            'border-width': `${styles.padding}`
        })
        padding.appendChild(div)
        document.body.appendChild(padding)
    }

    function flex() {
        const flex = document.createElement('div')
        const div = document.createElement('div')
        const childs = []
        flex.setAttribute('id', 'flex')
        Object.assign(flex.style, {
            'width': `${elem.clientWidth}px`,
            'height': `${elem.clientHeight}px`,
            'position': 'absolute',
            'left':  `${window.pageXOffset + rect.left}px`,
            'top':  `${window.pageYOffset + rect.top}px`,
            'padding': `${styles.padding ?? 0}`,
            'pointer-events': 'none',
            'z-index': '1001',
        })
        Object.assign(div.style, {
            'width': '100%',
            'height': '100%',
            'gap': `${styles.gap}`,
            'pointer-events': 'none',
            'overflow': 'auto',
            'display': 'flex',
            'justify-content': `${styles.justifyContent}`,
            'flex-direction': `${styles.flexDirection}`,
            'align-items': `${styles.alignItems}`,
            'background-color': 'rgb(255, 133, 133, 0.53)'
        })
        for (let item of elem.children) {
            let display = window.getComputedStyle(item, null).display
            if (display !== 'none') childs.push(item)
        }
        for (let i = 0; i < childs.length; i++) {
            let styles = window.getComputedStyle(childs[i], null)
            div.innerHTML += `
                <div style="min-width: ${childs[i].clientWidth}px; margin: ${styles.margin}; height: ${childs[i].clientHeight}px; background-color: rgb(255, 133, 133, 0.2); border: 3px dashed rgb(255, 133, 133, 1);"></div>
            `
        }
        flex.appendChild(div)
        document.body.appendChild(flex)
    }

    function grid() {
        const grid = document.createElement('div')
        const div = document.createElement('div')
        const childs = []
        grid.setAttribute('id', 'grid')
        Object.assign(grid.style, {
            'width': `${elem.clientWidth}px`,
            'height': `${elem.clientHeight}px`,
            'padding': `${styles.padding}`,
            'position': 'absolute',
            'pointer-events': 'none',
            'z-index': '1001',
            'left':  `${window.pageXOffset + rect.left}px`,
            'top':  `${window.pageYOffset + rect.top}px`,
        })
        Object.assign(div.style, {
            'width': '100%',
            'height': '100%',
            'gap': `${styles.gap}`,
            'pointer-events': 'none',
            'display': 'grid',
            'grid-template-columns': `${styles.gridTemplateColumns}`,
            'background-color': 'rgb(181, 107, 255, 0.53)'
        })
        for (let item of elem.children) {
            let display = window.getComputedStyle(item, null).display
            if (display !== 'none') childs.push(item)
        }
        for (let i = 0; i < childs.length; i++) {
            div.innerHTML += `
                <div style="width: 100%; background-color: rgb(181, 127, 255, 0.2); height: 100%; border: 3px dashed rgb(181, 127, 255);"></div>
            `
        }
        grid.appendChild(div)
        document.body.appendChild(grid)
    }

    function editTablet() {
        const editTablet = document.createElement('div')
        const textarea = document.createElement('textarea')
        editTablet.setAttribute('id', 'edit-tablet')
        Object.assign(editTablet.style, {
            'background-color': 'rgb(71, 71, 71)',
            'position': 'absolute',
            'color': 'white',
            'font-family': 'Montserrat',
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'flex-start',
            'border-radius': '10px',
            'padding': '10px',
            'border': '1px solid white',
            'z-index': '1003',
            'pointer-events': 'none',
            'left': `${mouseX - 30 - 225}px`,
            'top': `${mouseY + 20}px`,
        }),
        Object.assign(textarea.style, {
            'height': '100px',
            'background-color': 'rgb(105, 105, 105)',
            'color': 'white',
            'padding': '10px',
            'border-radius': '5px',
        }),
        editTablet.appendChild(textarea)
        document.body.appendChild(editTablet)
        textarea.focus()
        console.log(elem.innerHTML)
    }

    function removeEditTablet() {
        const editTablets = document.querySelectorAll('#edit-tablet')
        if (editTablets) {
            for (let item of editTablets) {
                item.remove()
            }
        }
    }

    function line() {
        const sections = document.querySelectorAll('section, .header')
        const container = document.querySelector('.container')
        const line = document.createElement('div')
        let sectionsArr = []
        let arr = []
        Object.assign(line.style, {
            'width': '100%',
            'height': '100vh',
            'pointer-events': 'none',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'z-index': '1003',
        })
        for (let item of sections) {
            sectionsArr.push(item.offsetTop + item.offsetHeight)
        }
        for (let item of sectionsArr) {
            const div = document.createElement('div')
            Object.assign(div.style, {
                'width': '100%',
                'height': '2px',
                'background-color': 'red',
                'position': 'absolute',
                'top': `${item}px`
            })
            line.appendChild(div)
        }

        if (container) {
            arr.push(container.getBoundingClientRect().left, container.getBoundingClientRect().left + container.clientWidth)
            for (let item of arr) {
                const div = document.createElement('div')
                Object.assign(div.style, {
                    'width': '2px',
                    'height': `${document.body.clientHeight}px`,
                    'background-color': 'red',
                    'position': 'absolute',
                    'left': `${item}px`
                })
                line.appendChild(div)
            }
        }
        console.log(sections)
        document.body.appendChild(line)
    }
    setTimeout(() => {
        line()
    }, 10)
})();