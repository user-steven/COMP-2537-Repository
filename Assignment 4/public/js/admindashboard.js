async function removeUser() {
    let userId = $(this).closest("div").attr("id")
    await $.ajax({
        url: `/api/DeleteUser/${userId}`,
        type: 'get',
        success: result => alert(result)
    })
    window.location.reload(true)
}

function setup() {
    $("#userAccount").on("click", ".removeUserButton", removeUser)
}

$(document).ready(setup)