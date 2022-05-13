function loadEvents() {
    $.ajax({
        url: "https://po-kedex.herokuapp.com/timeline/getAllEvents",
        type: "get",
        success: (data) => {
            $("main").empty()
            for (i=data.length - 1; i >= 0; i--) {
                $("main").append(
                    `
                    <p>
                        Event: ${data[i].search_event}
                        <br>
                        Time: ${data[i].time_event}
                        <br>
                        Likes: ${data[i].like_counter}
                        <br>
                        <span id="${data[i]._id}">
                        <button type="button" class="likeButton"> Like </button>
                        <button type="button" class="deleteButton"> Delete </button>
                        </span>
                    </p>
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
        url:`https://po-kedex.herokuapp.com/timeline/update/${timelineId}`,
        type: 'get',
        success: result => console.log(result)
    })
    loadEvents()
}

function deletePost() {
    let timelineId = $(this).parent().attr('id')
    // console.log(timelineId)
    $.ajax({
        url:`https://po-kedex.herokuapp.com/timeline/delete/${timelineId}`,
        type: 'get',
        success: result => console.log(result)
    })
    loadEvents()
}

function setup() {
    loadEvents()
    $("main").on('click', '.likeButton', increaseLike)
    $("main").on('click', '.deleteButton', deletePost)
}


$(document).ready(setup)
