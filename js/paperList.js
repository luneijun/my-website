//最大显示页码个数
let maxShowNum = 4;

//总记录数
let totalNum = 0;

//总页数
let pageCount = 0;

//默认每页显示数
let pageSize = 6;

//默认显示第一页
let currentPage = 1;

let paperList = [];

function getPageList(){
    $.getJSON("../mock/paperList.json", function (data,status) {
        if( status==='success') paperList = data;
        pageCount = (paperList.length%pageSize>0)?(paperList.length/pageSize+1):(paperList.length/pageSize);
        showPage();
        initPagination();
    })
}

function showPage() {
    console.log(currentPage)
    let showPage = paperList.slice((currentPage-1)*pageSize,currentPage*pageSize);
    $("#blogList").empty();
    $.each(showPage,function(i,paper){
        let card = '<div class="col-12 col-md-6 col-lg-4">';
        card += '<article class="card">';
        card += '<img class="card-img-top" src="'+paper.picture+'" alt="Article Image">';
        card += '<div class="card-body">';
        card += '<div class="card-subtitle mb-2 text-muted">by <a href="#">'+paper.author+'</a> '+paper.date+'</div>';
        card += '<h4 class="card-title"><a href="#" data-toggle="read" data-id="1">'+paper.title+'</a></h4>';
        card += '<p class="card-text">'+paper.brief+'</p>';
        card += '<div class="text-right">';
        card += '<a href="javascript:void(0);" class="card-more" data-toggle="learnMore" data-id="'+i+'">Read More <i class="ion-ios-arrow-right"></i></a>';
        card += '</div>';
        card += '</div>';
        card += '</article>';
        card += '</div>';
        $("#blogList").append(card);
    });
    $("[data-toggle=learnMore]").click(function(e) {
        learnMore(e);
    })
}

function initPagination() {
    let limit = (pageCount<maxShowNum)?pageCount:maxShowNum;
    let pagination = $("#paginationId");
    let previousLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="Previous" data-toggle="selectPage" data-id="previousPage"><span aria-hidden="true">&laquo;</span></a></li>';
    pagination.append(previousLi);
    for(let i = 1;i<=limit;i++){
        let li = '<li class="page-item"><a class="page-link" href="javascript:void(0);" data-toggle="selectPage" data-id="'+i+'">'+i+'</a></li>';
        pagination.append(li);
    }
    let nextLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="Next" data-toggle="selectPage" data-id="nextPage"><span aria-hidden="true">&raquo;</span></a></li>';
    pagination.append(nextLi);
    $("[data-toggle=selectPage]").click(function(e) {
        selectPage(e);
    })
}

function selectPage(e) {
    let newCurrentPage = e.currentTarget.dataset.id;
    if(newCurrentPage == "previousPage") {
        if(currentPage>1) currentPage--;
        else return;
    } else if(newCurrentPage == "nextPage") {
        if(currentPage<pageCount) currentPage++;
        else return;
    } else if(newCurrentPage == currentPage) {
        return;
    } else{
        currentPage = newCurrentPage;
    }
    showPage();
}

function learnMore(e) {
    $("body").css({
        overflow: "hidden"
    });
    let cardId = e.currentTarget.dataset.id;
    let $element = '<div class="article-read">';
    $element += '<div class="article-read-inner">';
    $element += '<div class="article-back">';
    $element += '<a class="btn btn-outline-primary"><i class="ion ion-chevron-left"></i> Back</a>';
    $element += '</div>';
    $element += '<h1 class="article-title">{title}</h1>';
    $element += '<div class="article-metas">';
    $element += '<div class="meta">';
    $element += '	{date}';
    $element += '</div>';
    $element += '<div class="meta">';
    $element += '	{category}';
    $element += '</div>';
    $element += '<div class="meta">';
    $element += '	{author}';
    $element += '</div>';
    $element += '</div>';
    $element += '<figure class="article-picture"><img src="{picture}"></figure>';
    $element += '<div class="article-content">';
    $element += '{content}';
    $element += '</div>';
    $element += '</div>';
    $element += '</div>';

    let data = paperList[cardId];
    console.log(data)
    let reg = /{([a-zA-Z0-9]+)}/g,
        element = $element;
    while(match = reg.exec($element)) {
        element = element.replace('{' + match[1] + '}', data[match[1]]);
    }
    $("body").prepend(element);
    $(".article-read").fadeIn();
    $(document).on("click", ".article-back .btn", function() {
        $(".article-read").fadeOut(function() {
            $(".article-read").remove();
            $("body").css({
                overflow: 'auto'
            });
        });
        return false;
    });
}




