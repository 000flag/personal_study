document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const legendEl = document.getElementById('counselorLegend');
    const searchInput = document.querySelector('.form-control');
    const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
    const boardList = document.getElementById('boardList');
    const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');

    let holidays = [];
    let allData = [];
    let calendar;
    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageSelect.value, 10);

    const counselorColors = {};
    const colorPalette = [
        '#4285f4',   // 파랑
        '#f4b400',   // 노랑
        '#0f9d58',   // 초록
        '#ab47bc',   // 보라
        '#00acc1',   // 청록
        '#ff7043'    // 주황
        // '#db4437' 빨강 제거
    ]

    fetch('data/holidays_2025.json')
        .then(res => res.json())
        .then(data => {
            holidays = data.map(h => h.date);
            initCalendar();
        })
        .catch(() => initCalendar());

    function initCalendar() {
        calendar = new FullCalendar.Calendar(calendarEl, {
            themeSystem: 'bootstrap5',
            locale: 'ko',
            initialView: 'dayGridMonth',
            dayMaxEventRows: true,
            height: 'auto',
            headerToolbar: {
                left: '',
                center: 'title',
                right: 'prev today next'
            },
            buttonText: {
                today: '오늘',
                month: '월',
                week: '주',
                day: '일',
                list: '목록'
            },
            titleFormat: { year: 'numeric', month: 'long' },
            dayCellContent: (arg) => {
                return { html: arg.dayNumberText.replace('일', '') };
            },
            dayCellClassNames: (arg) => {
                const yyyyMmDd = arg.date.toISOString().split('T')[0];
                if (arg.date.getDay() === 0 || holidays.includes(yyyyMmDd)) return 'fc-sunday fc-holiday';
                if (arg.date.getDay() === 6) return 'fc-saturday';
            },
            eventClick: info => showPopup(info.event.extendedProps)
        });

        calendar.render();
        loadEvents();
    }

    function loadEvents() {
        fetch('/api/consults')
            .then(res => res.ok ? res.json() : Promise.reject())
            .catch(() => fetch('data/consults_data.json').then(res => res.json()))
            .then(data => {
                allData = data;
                renderFilteredEvents();
                renderHolidays(); // 공휴일 표시 추가
            });
    }

    // 공휴일 표시 함수
    function renderHolidays() {
        holidays.forEach(date => {
            calendar.addEvent({
                title: '공휴일',
                start: date,
                allDay: true,
                display: 'auto',  // auto로 바꿔서 일반 이벤트처럼 출력
                backgroundColor: '#dc3545',  // 진한 빨강 배경
                textColor: '#fff',           // 흰색 글자
                classNames: ['holiday-event']  // 필요시 스타일링
            });
        });
    }

    function getCounselorColor(name) {
        if (!counselorColors[name]) {
            counselorColors[name] = colorPalette[Object.keys(counselorColors).length % colorPalette.length];
        }
        return counselorColors[name];
    }

    function renderLegend() {
        legendEl.innerHTML = '';
        Object.keys(counselorColors).forEach(name => {
            const div = document.createElement('div');
            div.className = 'd-flex align-items-center gap-1';
            div.innerHTML = `
                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${counselorColors[name]};"></span>
                <small>${name}</small>
            `;
            legendEl.appendChild(div);
        });
    }

    function renderFilteredEvents() {
        calendar.getEvents().forEach(e => e.remove());
        boardList.innerHTML = '';

        const searchText = searchInput.value.trim().toLowerCase();
        const activeOptions = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

        const filteredData = allData.filter(item => {
            if (!searchText) return true;

            if (activeOptions.length > 0) {
                return activeOptions.some(opt => {
                    const val = getValueByOption(item, opt).toLowerCase();
                    return val.includes(searchText);
                });
            } else {
                return [item.counselor, item.date, item.customerName, item.customerPhone || '', item.customerStage]
                    .some(field => field.toLowerCase().includes(searchText));
            }
        });

        filteredData.forEach(item => {
            const color = getCounselorColor(item.counselor);

            calendar.addEvent({
                id: item.id,
                title: item.title,
                start: item.date,
                backgroundColor: color,
                borderColor: color,
                extendedProps: item
            });
        });

        renderLegend();
        renderBoard(filteredData);
    }

    function renderBoard(data) {
        boardList.innerHTML = '';
        const startIdx = (currentPage - 1) * itemsPerPage;
        const pageData = data.slice(startIdx, startIdx + itemsPerPage);

        pageData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${item.date} - ${item.title}`;
            li.addEventListener('click', () => showPopup(item));
            boardList.appendChild(li);
        });

        renderPagination(data.length);
    }

    function renderPagination(totalItems) {
        let pagination = document.getElementById('boardPagination');
        if (!pagination) {
            pagination = document.createElement('nav');
            pagination.className = 'mt-2';
            pagination.innerHTML = `<ul class="pagination justify-content-center" id="boardPagination"></ul>`;
            boardList.parentElement.appendChild(pagination);
        }

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationUl = document.getElementById('boardPagination');
        paginationUl.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const btn = document.createElement('button');
            btn.className = 'page-link';
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderFilteredEvents();
            });
            li.appendChild(btn);
            paginationUl.appendChild(li);
        }
    }

    function getValueByOption(item, option) {
        switch (option) {
            case '상담사': return item.counselor;
            case '날짜': return item.date;
            case '고객정보-이름': return item.customerName;
            case '고객정보-번호': return item.customerPhone || '';
            case '고객흐름단계': return item.customerStage;
            default: return '';
        }
    }

    function showPopup(details) {
        document.getElementById('modalCustomerName').textContent = details.customerName || '';
        document.getElementById('modalCustomerPhone').textContent = details.customerPhone || '';
        document.getElementById('modalCounselor').textContent = details.counselor || '';
        document.getElementById('modalStage').textContent = details.customerStage || '';
        document.getElementById('modalContent').textContent = details.content || '';

        const commentsEl = document.getElementById('modalComments');
        commentsEl.innerHTML = '';  // 초기화

        if (details.comments && details.comments.length > 0) {
            details.comments.forEach(c => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-start';
                li.innerHTML = `
                <div>
                    <div>${c.content}</div>
                    <small class="text-muted">${c.date}</small>
                </div>
                ${c.isRead ? '' : '<span class="badge bg-danger rounded-pill">미확인</span>'}
            `;
                commentsEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'list-group-item text-muted';
            li.textContent = '등록된 댓글이 없습니다.';
            commentsEl.appendChild(li);
        }

        const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
        detailModal.show();
    }

    searchInput.addEventListener('input', () => { currentPage = 1; renderFilteredEvents(); });
    checkboxes.forEach(cb => cb.addEventListener('change', () => { currentPage = 1; renderFilteredEvents(); }));
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
        currentPage = 1;
        renderFilteredEvents();
    });

    document.getElementById('calendarBtn').addEventListener('click', () => {
        document.getElementById('calendarContainer').classList.remove('d-none');
        document.getElementById('boardContainer').classList.add('d-none');
        document.getElementById('counselorLegend').classList.remove('d-none');
        setTimeout(() => calendar.updateSize(), 0);
    });

    document.getElementById('boardBtn').addEventListener('click', () => {
        document.getElementById('calendarContainer').classList.add('d-none');
        document.getElementById('boardContainer').classList.remove('d-none');
        document.getElementById('counselorLegend').classList.add('d-none');
    });
});
