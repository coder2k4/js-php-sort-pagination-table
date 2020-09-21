class Table {

    // Получаем селектор на нашу таблицу
    constructor(selector) {
        this.table = document.querySelector(selector)
        this.body = [] // содержится html table body
        this.data = [
            {'date': '20/10/2019', 'name': 'apex', 'count': 1, 'distance': 100},
            {'date': '20/10/2019', 'name': 'bapex', 'count': 2, 'distance': 101},
            {'date': '20/10/2019', 'name': 'dapex', 'count': 3, 'distance': 102},
            {'date': '20/10/2019', 'name': 'capex', 'count': 4, 'distance': 103},
            {'date': '20/10/2019', 'name': 'eapex', 'count': 5, 'distance': 104},
            {'date': '20/10/2019', 'name': 'fapex', 'count': 6, 'distance': 105},
            {'date': '20/10/2019', 'name': 'gapex', 'count': 7, 'distance': 106},
            {'date': '20/10/2019', 'name': 'hapex', 'count': 8, 'distance': 1000},
            {'date': '20/10/2019', 'name': 'iapex', 'count': 9, 'distance': 10001},
            {'date': '20/10/2019', 'name': 'japex', 'count': 10, 'distance': 10002},
            {'date': '20/10/2019', 'name': 'kapex', 'count': 11, 'distance': 10003},
            {'date': '20/10/2019', 'name': 'lapex', 'count': 12, 'distance': 10004},
            {'date': '20/10/2019', 'name': 'mapex', 'count': 13, 'distance': 10005},
            {'date': '20/10/2019', 'name': 'napex', 'count': 14, 'distance': 900},
            {'date': '20/10/2019', 'name': 'oapex', 'count': 15, 'distance': 901},
            {'date': '20/10/2019', 'name': 'papex', 'count': 16, 'distance': 902},
            {'date': '20/10/2019', 'name': 'qapex', 'count': 17, 'distance': 906},
            {'date': '20/10/2019', 'name': 'rapex', 'count': 18, 'distance': 904},
        ] // дата представленная в json // Тестовый набор данных

        this.fetchData().then()

        this.filter = {
            column: '',
            condition: '',
            value: ''
        } // наши настройки фильра

        this.pagiSetup = {
            perPage: 5,
            page: 1,
            pages: 1,
            paginationButtons: []
        }

    }

    // Функция для рендера html педставления заголовкой таблицы
    renderHeader() {
        this.header = Object.keys(this.data[0]).map(key => `            
                <th data-column="${key}" data-order="desc">${key} &#9632</th>                       
        `)
    }

    // Запрос данных с API , no-cors
    async fetchData()
    {
        const response = await fetch('http://php-rest-api')
        this.data = await response.json()
        this.render()
    }

    // Функция для рендера html педставления данных в таблице
    renderBody(fdata) {
        const data = this.pagination(fdata ? fdata : this.data)
        this.paginationBtnsRender()
        this.body = []
        for (let i = 0; i < data.length; i++) {
            this.body[i] = `
                <tr>
                    <td>${data[i].date}</td>
                    <td>${data[i].name}</td>
                    <td>${data[i].count}</td>
                    <td>${data[i].distance}</td>
                </tr>                
            `
        }
    }

    // Функция для рендера html педставления нашего фильтра
    renderFilter() {
        const selectColumn = '<select name="column[]" id="column">' + '<option disabled selected>Выберите колонку для фильтрации</option>' +
            Object.keys(this.data[0]).map(key => key != 'date' && ` <option value="${key}">${key}</option>`).join('') +
            '</select>'

        const selectFilter = `
            <select id="condition">
                <option disabled selected>Условие</option>
                <option value="equals">равно</option>
                <option value="contains">содержит</option>
                <option value="over">больше</option>
                <option value="less">меньше</option>
            </select>
        `
        const input = `<input type="text" id="filter" placeholder="Значения для фильтрации" value="">`

        return selectColumn + selectFilter + input
    }

    //Рендер кнопок пагинации
    paginationRender() {
        let btns = ""
        for (let page = 1; page <= this.pagiSetup.pages; page++)
            if (page === this.pagiSetup.page)
                btns += `<button value="${page}" class="active">${page}</button>`
            else
                btns += `<button value="${page}">${page}</button>`

        return btns
    }


    // Функция объединяет в себе все рендеры
    render(data) {
        if (!this.header) {
            this.renderHeader()
            this.renderBody()
            this.table.innerHTML = `        
                <table class="table">
                    <thead>
                        <tr>
                            ${this.header.join('')}                
                        </tr>
                    </thead>
                
                    <tbody>
                            ${this.body.join('')}                    
                    </tbody>
                </table>   
                
                <div class="selectors">                
                    ${this.renderFilter()}
                </div>    
                
                <div class="pagination">
                    ${this.paginationRender()}
                </div>            
            `
        } else {
            this.renderBody(data)
            const tbody = this.table.querySelector('tbody')
            tbody.innerHTML = `<tbody>${this.body.join('')}</tbody>`
        }
        return this
    }

    // Пагинашка
    pagination(data) {
        const start = (this.pagiSetup.page - 1) * this.pagiSetup.perPage
        const end = start + this.pagiSetup.perPage

        this.pagiSetup.pages = Math.ceil(data.length / this.pagiSetup.perPage)
        const pagiData = data.slice(start, end)
        return pagiData
    }

    //Управление отображением кнопок
    paginationBtnsRender() {
        this.pagiSetup.paginationButtons.forEach((btn, i)=> {
            btn.classList.remove('active')
            if (i >= this.pagiSetup.pages)
                btn.style.display = 'none'
            else
                btn.style.display = 'inline-block'
        })
    }

    // Проверка, выставлены ли все фильры
    checkFilter() {
        let filled = true
        Object.keys(this.filter).forEach(key => {
            if (this.filter[key] == "")
                filled = false
        })

        return filled ? true : false

    }


    // Функция для фильтрации данных
    filtrate() {
        if (!this.checkFilter())
            return

        const filtered = this.data.filter(data => {
            switch (this.filter.condition) {
                case "equals": {
                    if (data[this.filter.column] == this.filter.value)
                        return true
                    else
                        return false
                }
                case "contains": {
                    if (data[this.filter.column].toString().includes(this.filter.value))
                        return true
                    else
                        return false
                }
                case "over": {
                    if (data[this.filter.column] > this.filter.value)
                        return true
                    else
                        return false
                }
                case "less":
                    if (data[this.filter.column] < this.filter.value)
                        return true
                    else
                        return false
            }
        })

        this.render(filtered)
    }

    // Инициализация всех прослушей
    init() {
        const ths = this.table.querySelectorAll('th')
        const columnSelection = this.table.querySelector('#column')
        const conditionSelection = this.table.querySelector('#condition')
        const filterSelection = this.table.querySelector('#filter')
        this.pagiSetup.paginationButtons = this.table.querySelectorAll('.pagination button')


        ths.forEach(th => th.addEventListener('click', (e) => {

            const column = e.target.dataset.column
            if (column === 'date') // skip date
                return

            const order = e.target.dataset.order
            let text = e.target.textContent.slice(0, -1)

            if (order == 'desc') {
                e.target.dataset.order = 'asc'
                this.data = this.data.sort((a, b) => a[column] > b[column] ? 1 : -1)
                text += '&#9660'
            } else {
                e.target.dataset.order = 'desc'
                this.data = this.data.sort((a, b) => a[column] < b[column] ? 1 : -1)
                text += '&#9650'
            }

            ths.forEach(th => th.innerHTML = th.textContent.slice(0, -1) + '&#9632')

            e.target.innerHTML = text
            this.render()
        }))


        columnSelection.addEventListener('change', (e) => {
            if (e.target.value)
                this.filter.column = e.target.value

            if (e.target.value === 'name') {
                conditionSelection.value = 'contains'
                this.filter.condition = 'contains'
                conditionSelection.disabled = true
            } else {
                this.filter.condition = conditionSelection.value
                conditionSelection.disabled = false
            }

            filterSelection.value = ""
            this.filter.value = ""

            this.render()

            //this.filtrate()
        })

        conditionSelection.addEventListener('change', (e) => {

            if (e.target.value)
                this.filter.condition = e.target.value

            this.filtrate()
        })

        filterSelection.addEventListener('input', (e) => {
            if (e.target.value)
                this.filter.value = e.target.value

            if (e.target.value != "")
                this.filtrate()
            else
                this.render()
        })

        this.pagiSetup.paginationButtons.forEach(btn => btn.addEventListener('click', (e) => {
                this.pagiSetup.page = e.target.value
                e.target.classList.add('active')
                this.render()
                this.filtrate()
            }))
    }
}


// Создаем инстанс, запускаем рендер и инициализируем прослушки
new Table('#table').render().init()



