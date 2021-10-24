//最大显示页码个数
let maxShowNum = 3;

//总记录数
let totalNum = 0;

//总页数
let pageCount = 0;

//默认每页显示数
let pageSize = 6;

//默认显示第一页
let currentPage = 1;

let paperList = [];

function getPageList(loading){
    $.ajax({
        url: "../mock/paperList.json",
        dataType: 'json',
        beforeSend: function() {
            loading.show();
        },
        complete: function() {
            loading.hide();
        },
        success: function(data) {
            paperList = data;
            pageCount = (paperList.length%pageSize>0)?(Math.ceil(paperList.length/pageSize)):(Math.floor(paperList.length/pageSize));
            showPage();
            initPagination();
        }
    });
}

function showPage() {
    let showPage = paperList.slice((currentPage-1)*pageSize,currentPage*pageSize);
    let previousPageCount = (currentPage-1)*pageSize
    $("#blogList").empty();
    $.each(showPage,function(i,paper){
        let card = '<div class="col-12 col-md-6 col-lg-4">';
        card += '<article class="card">';
        card += '<img class="card-img-top" src="'+paper.picture+'" alt="Article Image">';
        card += '<div class="card-body">';
        card += '<div class="card-subtitle mb-2 text-muted"><a href="'+paper.github+'">GITHUB</a>&nbsp;&nbsp;<a href="'+paper.pdf+'">PDF</a>&nbsp;&nbsp;&nbsp;&nbsp;'+paper.date+'</div>';
        card += '<h4 class="card-title"><a href="#" data-toggle="read" data-id="1">'+paper.title+'</a></h4>';
        card += '<p class="card-text">'+paper.brief+'</p>';
        card += '<div class="text-right">';
        card += '<a href="javascript:void(0);" class="card-more" data-toggle="learnMore" data-id="'+(i+previousPageCount)+'">Read More <i class="ion-ios-arrow-right"></i></a>';
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
    if(pageCount==0) return;
    debugger
    let pagination = $("#paginationId");
    pagination.empty();
    let previousLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="Previous" data-toggle="selectPage" data-id="previousPage"><span aria-hidden="true">&laquo;</span></a></li>';
    pagination.append(previousLi);
    let firstLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="first" data-toggle="selectPage" data-id="1"><span aria-hidden="true">1</span></a></li>';
    pagination.append(firstLi);
    if(pageCount!=1) {
        if(pageCount>2)
        {
            let i;
            let limit;
            let half = (maxShowNum-1)/2
            let upperLimit = currentPage-half;
            let lowerLimit = currentPage+half;
            if(pageCount<=maxShowNum+2) {
                i = 2;
                limit = pageCount-1;
            }else {
                if((upperLimit)<=1&&(lowerLimit)<pageCount) {
                    i = 2;
                    limit = maxShowNum +1;
                }else if((upperLimit)>1&&(lowerLimit)>=pageCount) {
                    i = pageCount-maxShowNum;
                    limit = pageCount-1;
                }else if((upperLimit)<=1&&(lowerLimit)>=pageCount) {
                    i = 2;
                    limit = pageCount-1;
                }else {
                    i = currentPage-half;
                    limit = currentPage+half;
                }
            }
            for(;i<=limit;i++){
                let li = '<li class="page-item"><a class="page-link" href="javascript:void(0);" data-toggle="selectPage" data-id="'+i+'">'+i+'</a></li>';
                pagination.append(li);
            }
        }
        let lastLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="last" data-toggle="selectPage" data-id="'+pageCount+'"><span aria-hidden="true">'+pageCount+'</span></a></li>';
        pagination.append(lastLi);
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
        if(currentPage<pageCount) {
            currentPage++;
        }
        else return;
    } else if(newCurrentPage == currentPage) {
        return;
    } else{
        currentPage = parseInt(newCurrentPage);
    }
    initPagination();
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
    $element += '<div class="meta">';
    $element += '	<a href="{github}">github</a>';
    $element += '</div>';
    $element += '<div class="meta">';
    $element += '	<a href="{pdf}">pdf</a>';
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




