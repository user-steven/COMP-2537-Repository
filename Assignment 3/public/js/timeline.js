function loadEvents() {
    $.ajax({
        url: "/timeline/getAllEvents",
        type: "get",
        success: (data) => {
            $("main").empty()
            for (i = data.length - 1; i >= 0; i--) {
                $("main").append(
                    `
                    <div class="timelineCard">
                    <table>
                    <tr><th>User:</th><td>${data[i].name}</td></tr>
                    <tr><th>Event:</th><td>${data[i].search_event}</td></tr>
                    <tr><th>Time:</th><td>${data[i].time_event}</td></tr>
                    <tr><th>Likes:</th><td>${data[i].like_counter}</td></tr>
                    </table>
                        <span id="${data[i]._id}">
                            <button type="button" class="like_Button timelineButtonStyle"> Like </button>
                            <button type="button" class="delete_Button timelineButtonStyle"> Delete </button>
                        </span>
                    </div>
                    `
                )
            }
        }
    })
}

function increaseLike() {
    let timelineId = $(this).parent().attr('id')
    // console.log(timelineId)
    $.ajax({
        url: `/timeline/update/${timelineId}`,
        type: 'get',
        success: result => console.log(result)
    })
    location.reload()
}

function deletePost() {
    let timelineId = $(this).parent().attr('id')
    // console.log(timelineId)
    $.ajax({
        url: `/timeline/delete/${timelineId}`,
        type: 'get',
        success: result => console.log(result)
    })
    location.reload()
}

function setup() {
    loadEvents()
    $("main").on('click', '.like_Button', increaseLike)
    $("main").on('click', '.delete_Button', deletePost)
}


$(document).ready(setup)
