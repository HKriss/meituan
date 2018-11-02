function init() {
    $.ajax({
        url: "/api/info",
        success: function(data) {
            var data = JSON.parse(data);
            listRender(data);
        }
    });
}

init()

function listRender(data) {
    if (data.code === 0) {
        var html = "";
        data.msg.forEach(function(item) {
            html += `<dl>
            <dt><img src="img/${item.src}" alt=""></dt>
            <dd>
                <div class="tops">
                    <p>${item.title}</p>
                    <p>${item.detail}</p>
                </div>
                <div class="bottom">
                    <p>
                        <span>${item.price}</span>
                        <b>${item.men}</b>
                    </p>
                    <span>已售3555份</span>
                </div>
            </dd>
        </dl>`;
        });
        $('.info').append(html);
    }
}
var list = new BScroll('section', {
    click: true,
    probeType: 2
});
list.on('scroll', function() {
    if (this.y < this.maxScrollY - 60) {
        $("#down").html('上拉加载更多...').addClass('file');
    } else if (this.y < this.maxScrollY - 10) {
        $("#down").html('上拉加载').removeClass('file');
    } else if (this.y > 60) {
        $("#up").html('释放刷新').addClass('file');
    } else if (this.y > 10) {
        $("#up").html('下拉刷新').removeClass('file');
    }
});
list.on('scrollEnd', function() {
    if ($("#down").hasClass('file')) {
        $("#down").html('上拉加载').removeClass('file');
        down();
    } else if ($("#up").hasClass('file')) {
        $("#up").html('下拉刷新').removeClass('file');
        up();
    }
});

function down() {
    init();
}

function up() {
    $('.info').html('');
    init()
}
var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: ".swiper-pagination"
    },
    on: {
        slideChange: function() {
            var ind = this.activeIndex;
            $.ajax({
                url: "/api/list?index=" + ind,
                success: function(data) {
                    var data = JSON.parse(data);
                    if (data.code === 0) {
                        render(data.msg);
                    }
                }
            })
        }
    }
});

// 默认swiper
$.ajax({
    url: "/api/list?index=" + 0,
    success: function(data) {
        var data = JSON.parse(data);
        if (data.code === 0) {
            render(data.msg);
        }
    }
});


function render(data) {
    var html = "";
    data.title.forEach(function(item) {
        html += `<dl>
            <dt><img src="${item.img}" alt=""></dt>
            <dd>${item.title}</dd>
        </dl>`;
    });
    $('.swiper-slide').html(html);
}