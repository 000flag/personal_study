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
        '#4285f4', '#f4b400', '#0f9d58', '#ab47bc', '#00acc1', '#ff7043'
    ];

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
                left: 'prev today next',
                center: 'title',
                right: ''
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
                renderHolidays();
            });
    }

    function renderHolidays() {
        holidays.forEach(date => {
            calendar.addEvent({
                title: '공휴일',
                start: date,
                allDay: true,
                display: 'auto',
                backgroundColor: '#dc3545',
                textColor: '#fff',
                classNames: ['holiday-event']
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

        // 각 상담사별 상담 수 계산
        const counts = {};
        allData.forEach(item => {
            if (!counts[item.counselor]) counts[item.counselor] = 0;
            counts[item.counselor]++;
        });

        // 상담사 이름 + 수를 배열로 정리하고 상담 수로 내림차순 정렬
        const sortedCounselors = Object.keys(counselorColors)
            .map(name => ({ name, count: counts[name] || 0 }))
            .sort((a, b) => b.count - a.count);

        sortedCounselors.forEach(({ name, count }) => {
            const div = document.createElement('div');
            div.className = 'd-flex align-items-center gap-1 justify-content-between';
            div.innerHTML = `
                <div class="d-flex align-items-center gap-1">
                    <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${counselorColors[name]};"></span>
                    <small>${name}</small>
                </div>
                <small class="text-muted">${count}</small>
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

    function getStageBadgeClass(stage) {
        switch (stage) {
            case '접수':
                return 'bg-primary';
            case '진행중':
                return 'bg-warning text-dark';
            case '완료':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    }

    function renderBoard(data) {
        boardList.innerHTML = '';
        const startIdx = (currentPage - 1) * itemsPerPage;
        const pageData = data.slice(startIdx, startIdx + itemsPerPage);

        pageData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.style.cursor = 'pointer';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'board-item-header';
            const stageBadgeClass = getStageBadgeClass(item.customerStage);
            headerDiv.innerHTML = `
            <i class="bi bi-caret-down-fill"></i>
            <span>${item.date} - ${item.title}</span>
            <span class="ms-2 text-muted small">[${item.counselor}]</span>
            <span class="badge ${stageBadgeClass} ms-2">${item.customerStage || '없음'}</span>
        `;
            li.appendChild(headerDiv);

            const detailDiv = document.createElement('div');
            detailDiv.className = 'mt-2 toggle-detail';
            detailDiv.style.maxHeight = '0';
            detailDiv.style.overflow = 'hidden';
            detailDiv.style.transition = 'max-height 0.3s ease';

            let commentsHtml = '';

            if (item.comments && item.comments.length > 0) {
                commentsHtml = `
                <hr />
                <h6>💬 슈퍼바이저 댓글</h6>
                <ul class="list-group">
                    ${item.comments.map(c => `
                        <li class="list-group-item comment-item d-flex justify-content-between align-items-start">
                            <div>
                                <div>${c.content}</div>
                                <small class="text-muted">${c.date}</small>
                            </div>
                            ${c.isRead ? '' : '<span class="badge bg-danger rounded-pill">미확인</span>'}
                        </li>
                    `).join('')}
                </ul>
            `;
            } else {
                commentsHtml = `
                <hr />
                <h6>💬 슈퍼바이저 댓글</h6>
                <ul class="list-group">
                    <li class="list-group-item text-muted comment-item">등록된 댓글이 없습니다.</li>
                </ul>
            `;
            }

            detailDiv.innerHTML = `
            <p><strong>고객명:</strong> ${item.customerName || ''}</p>
            <p><strong>연락처:</strong> ${item.customerPhone || ''}</p>
            <p><strong>담당 상담사:</strong> ${item.counselor || ''}</p>
            <p><strong>진행 단계:</strong> ${item.customerStage || ''}</p>
            <p><strong>상담 내용:</strong></p>
            <p class="border rounded p-2">${item.content || ''}</p>
            ${commentsHtml}
        `;
            li.appendChild(detailDiv);

            li.addEventListener('click', () => {
                const isExpanded = detailDiv.style.maxHeight !== '0px' && detailDiv.style.maxHeight !== '0';
                const icon = headerDiv.querySelector('i');

                if (isExpanded) {
                    detailDiv.style.maxHeight = '0';
                    icon.classList.remove('bi-caret-up-fill');
                    icon.classList.add('bi-caret-down-fill');
                } else {
                    detailDiv.style.maxHeight = detailDiv.scrollHeight + 'px';
                    icon.classList.remove('bi-caret-down-fill');
                    icon.classList.add('bi-caret-up-fill');
                }
            });

            boardList.appendChild(li);
        });

        renderPagination(data.length);
        updateBoardSummary(data);
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

        const blockSize = 3; // 블록당 페이지 수
        const currentBlock = Math.ceil(currentPage / blockSize);
        const startPage = (currentBlock - 1) * blockSize + 1;
        let endPage = startPage + blockSize - 1;
        if (endPage > totalPages) endPage = totalPages;

        // 이전 블록 버튼
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentBlock === 1 ? 'disabled' : ''}`;
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-link';
        prevBtn.innerHTML = `<i class="bi bi-chevron-left"></i>`;
        prevBtn.addEventListener('click', () => {
            if (currentBlock > 1) {
                currentPage = (startPage - blockSize) > 0 ? (startPage - blockSize) : 1;
                renderFilteredEvents();
            }
        });
        prevLi.appendChild(prevBtn);
        paginationUl.appendChild(prevLi);

        // 페이지 번호
        for (let i = startPage; i <= endPage; i++) {
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

        // 다음 블록 버튼
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${endPage === totalPages ? 'disabled' : ''}`;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-link';
        nextBtn.innerHTML = `<i class="bi bi-chevron-right"></i>`;
        nextBtn.addEventListener('click', () => {
            if (endPage < totalPages) {
                currentPage = endPage + 1;
                renderFilteredEvents();
            }
        });
        nextLi.appendChild(nextBtn);
        paginationUl.appendChild(nextLi);
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
        commentsEl.innerHTML = '';

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

    function updateBoardSummary(data) {
        const summaryEl = document.getElementById('boardSummary');
        const total = data.length;
        const stageCounts = {};

        data.forEach(item => {
            const stage = item.customerStage || '없음';
            if (!stageCounts[stage]) stageCounts[stage] = 0;
            stageCounts[stage]++;
        });

        const stageText = Object.entries(stageCounts)
            .map(([stage, count]) => `${stage}: ${count}`)
            .join(' | ');

        summaryEl.textContent = `총 상담: ${total} | ${stageText}`;
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

        // 버튼 스타일 토글
        document.getElementById('calendarBtn').classList.remove('btn-outline-secondary');
        document.getElementById('calendarBtn').classList.add('btn-outline-primary');
        document.getElementById('boardBtn').classList.remove('btn-outline-primary');
        document.getElementById('boardBtn').classList.add('btn-outline-secondary');
    });

    document.getElementById('boardBtn').addEventListener('click', () => {
        document.getElementById('calendarContainer').classList.add('d-none');
        document.getElementById('boardContainer').classList.remove('d-none');
        document.getElementById('counselorLegend').classList.add('d-none');

        // 버튼 스타일 토글
        document.getElementById('boardBtn').classList.remove('btn-outline-secondary');
        document.getElementById('boardBtn').classList.add('btn-outline-primary');
        document.getElementById('calendarBtn').classList.remove('btn-outline-primary');
        document.getElementById('calendarBtn').classList.add('btn-outline-secondary');
    });
});
