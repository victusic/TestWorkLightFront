$(document).ready( function(){

	//добавление задачи
	$('.add-task-button').bind('click', function(){
		$(".add-task-text-plate").css("display", "block");
		$(".add-task-button").css("display", "none");
	});

	$('.add-task-save').bind('click', function(){
		$(".add-task-text-plate").css("display", "none");
		$(".add-task-button").css("display", "block");
		$('.add-task-input').val().length > 32 ? alert("текст задачи не может превышать 32 символов") : addTask($('.add-task-input').val())
	});

	//выполнение задачи

	$('.tasks-plate').on('click', '.table-task-check', function () {
	    const $item = $(this).closest(".table-task");
	    const taskId = $item.data("id");
	    const isChecked = $(this).prop("checked");

	    const oldText = $item.find(".table-task-text").html();

	    {isChecked ? updateTask(taskId, oldText, 1, 0) : updateTask(taskId, oldText, 0, 0)}
	    {isChecked 
	    	? $item.find(".table-task-text").addClass("strikethrough-text")
	    	: $item.find(".table-task-text").removeClass("strikethrough-text") 
	    }
	});

	//переминование задачи

	$('.tasks-plate').on('click', '.table-task-rename', function () {
	    const $item = $(this).closest(".table-task");
	    $item.find(".table-task-text").css("display", "none");
	    $item.find(".rename-task-plate").css("display", "block");

	    const oldText = $item.find(".table-task-text").html();
	    $item.find(".rename-task-input").html(oldText);

	    $item.find(".table-task-check").css("display", "none");
	    $item.find(".table-task-rename").css("display", "none");
	    $item.find(".table-task-delete").css("display", "none");
	});

	$('.tasks-plate').on('click', '.rename-task-save', function () {
	    const $item = $(this).closest(".table-task");
	    const taskId = $item.data("id");

	    const isChecked = $(this).prop("checked");

	    const newText = $item.find(".rename-task-input").val();

	    if (newText.length > 32) {
	    	alert("текст задачи не может превышать 32 символов")
	    }
	    else{
	    	{isChecked ? updateTask(taskId, newText, 1, 1) : updateTask(taskId, newText, 0, 1)}
	    }
	    
	    $item.find(".table-task-text").css("display", "block");
		$item.find(".rename-task-plate").css("display", "none");

		$item.find(".table-task-check").css("display", "block");
		$item.find(".table-task-rename").css("display", "block");
		$item.find(".table-task-delete").css("display", "block");
	});

	//удаление задачи

	$('.tasks-plate').on('click', '.table-task-delete', function () {
	    const $item = $(this).closest(".table-task");
	    const taskId = $item.data("id");
	    deleteTask(taskId);
	});

	async function getTasks() {
	    try {
	        const response = await $.ajax({
	            url: 'https://testworkdb.birthdaydatabot.online/tasks',
	            method: 'GET',
	            dataType: 'json',
	            data: { text: 'Текст' }
	        });

	        // Очистка контейнера перед добавлением новых задач
	        $('.tasks-plate').empty();

	        // Обработка полученных задач и добавление их в контейнер
	        response.forEach(function (task, index) {
	        	const isChecked = task.status == 1 ? 'checked' : '';
	            const taskHtml = `<section class="table-task" data-id="${task.id}">
	                <h4 class="table-task-number"><b>${index + 1}</b></h4>
	                <p class="table-task-text ${isChecked ? 'strikethrough-text' : ''}">${task.text}</p>
	                <div class="rename-task-plate">
	                    <textarea type="text" class="rename-task-input"></textarea>
	                    <button class="rename-task-save">
	                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
	                            <path d="M6 4H3C2.46957 4 1.96086 4.21071 1.58579 4.58579C1.21071 4.96086 1 5.46957 1 6V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H17C17.5304 17 18.0391 16.7893 18.4142 16.4142C18.7893 16.0391 19 15.5304 19 15V6C19 5.46957 18.7893 4.96086 18.4142 4.58579C18.0391 4.21071 17.5304 4 17 4H14M13 8L10 11M10 11L7 8M10 11V1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-stroke"/>
	                        </svg>
	                    </button>
	                </div>
	                <input type="checkbox" class="table-task-check" ${isChecked}>
	                <button type="button" class="table-task-button table-task-rename">
	                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	                        <path d="M12 12L8 16H18V12H12ZM9.06 3.19L0 12.25V16H3.75L12.81 6.94L9.06 3.19ZM2.92 14H2V13.08L9.06 6L10 6.94L2.92 14ZM15.71 4.04C16.1 3.65 16.1 3 15.71 2.63L13.37 0.29C13.1825 0.103991 12.9291 -0.000383377 12.665 -0.000383377C12.4009 -0.000383377 12.1475 0.103991 11.96 0.29L10.13 2.12L13.88 5.87L15.71 4.04Z" class="svg-color"/>
	                    </svg>
	                </button>
	                <button class="table-task-button table-task-delete">
	                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
	                        <path d="M3 18C2.45 18 1.979 17.804 1.587 17.412C1.195 17.02 0.999333 16.5493 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.804 17.021 14.412 17.413C14.02 17.805 13.5493 18.0007 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" class="svg-color"/>
	                    </svg>
	                </button>
	            </section>`;
	            $('.tasks-plate').append(taskHtml);
	        });
	    } catch (error) {
	        console.error('Произошла ошибка при получении задач:', error);
	    }
	}

	async function updateTask(id, text, status, update) {
		const requestData = {
            Text: text,
            Status: status
        };
		try {
	        const response = await $.ajax({
	            url: `https://testworkdb.birthdaydatabot.online/task/${id}`,
	            method: 'PATCH',
	            contentType: 'application/json',
            	data: JSON.stringify(requestData),
            	dataType: 'json'
	        });
	    } catch (error) {
	        console.error('Произошла ошибка при обновлении задачи:', error);
	    }

	    if (update) {
	    	getTasks();
	    }
	}

	async function deleteTask(id) {
	    try {
	        const response = await $.ajax({
	            url: `https://testworkdb.birthdaydatabot.online/task/${id}`,
	            method: 'DELETE',
	            cache: false
	        });
	        getTasks();
	    } catch (error) {
	        console.error('Произошла ошибка при удалении задачи:', error);
	    }
	}

	async function addTask(text) {
	    try {
	        const response = await $.ajax({
	            url: 'https://testworkdb.birthdaydatabot.online/task',
	            method: 'POST',
	            data: { Text: text, Status: 0 }
	        });
	        getTasks(); 
	    } catch (error) {
	        console.error('Произошла ошибка при добавлении задачи:', error);
	    }
	}

	getTasks();
});