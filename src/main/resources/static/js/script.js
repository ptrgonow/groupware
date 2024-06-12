(function($) {
    "use strict";

    var $wrapper = $('.main-wrapper');
    var $pageWrapper = $('.page-wrapper');
    var $slimScrolls = $('.slimscroll');

    feather.replace();

    // 사이드 메뉴 기능 관련 코드
    var Sidemenu = function() {
        this.$menuItem = $('#sidebar-menu a');
    };

    function init() {
        var $this = Sidemenu;

        // 사이드 메뉴 클릭 이벤트 처리
        $('#sidebar-menu a').on('click', function(e) {
            if ($(this).parent().hasClass('submenu')) {
                e.preventDefault();
            }
            if (!$(this).hasClass('subdrop')) {
                $('ul', $(this).parents('ul:first')).slideUp(350);
                $('a', $(this).parents('ul:first')).removeClass('subdrop');
                $(this).next('ul').slideDown(350);
                $(this).addClass('subdrop');
            } else if ($(this).hasClass('subdrop')) {
                $(this).removeClass('subdrop');
                $(this).next('ul').slideUp(350);
            }
        });

        // 활성화된 메뉴 아이템 처리
        $('#sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');
    }

    init();

    // 사이드바 오버레이 추가
    $('body').append('<div class="sidebar-overlay"></div>');

    // 모바일 메뉴 버튼 클릭 이벤트 처리
    $(document).on('click', '#mobile_btn', function() {
        $wrapper.toggleClass('slide-nav');
        $('.sidebar-overlay').toggleClass('opened');
        $('html').addClass('menu-opened');
        return false;
    });

    // 사이드바 오버레이 클릭 이벤트 처리
    $(".sidebar-overlay").on("click", function() {
        $wrapper.removeClass('slide-nav');
        $(".sidebar-overlay").removeClass("opened");
        $('html').removeClass('menu-opened');
    });

    // 모바일 메뉴 닫기 버튼 클릭 이벤트 처리
    $("#mobile_btn_close").click(function() {
        $("html").removeClass("menu-opened");
        $(".main-wrapper").removeClass("slide-nav");
        $(".sidebar-overlay").removeClass("opened");
    });

    // 페이지 높이 설정
    if ($('.page-wrapper').length > 0) {
        var height = $(window).height();
        $(".page-wrapper").css("min-height", height);
    }

    // 창 크기 조정 시 페이지 높이 재설정
    $(window).resize(function() {
        if ($('.page-wrapper').length > 0) {
            var height = $(window).height();
            $(".page-wrapper").css("min-height", height);
        }
    });

    // select2 초기화 (만약 select 요소가 있다면)
    if ($('.select').length > 0) {
        $('.select').select2({
            minimumResultsForSearch: -1,
            width: '100%'
        });
    }

    // datetimepicker 초기화 (만약 datetimepicker 요소가 있다면)
    if ($('.datetimepicker').length > 0) {
        $('.datetimepicker').datetimepicker({
            format: 'DD-MM-YYYY',
            icons: {
                up: "fas fa-angle-up",
                down: "fas fa-angle-down",
                next: 'fas fa-angle-right',
                previous: 'fas fa-angle-left'
            }
        });
    }

    // 툴팁 초기화
    if ($('[data-toggle="tooltip"]').length > 0) {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // 데이터 테이블 초기화 (만약 datatable 클래스가 있다면)
    if ($('.datatable').length > 0) {
        $('.datatable').DataTable({
            "bFilter": false,
        });
    }

    // 슬림 스크롤 초기화
    if ($slimScrolls.length > 0) {
        $slimScrolls.slimScroll({
            height: '100%',
            width: '100%',
            position: 'right',
            size: '7px',
            color: '#ccc',
            allowPageScroll: false,
            wheelStep: 10,
            touchScrollStep: 100
        });
        var wHeight = $(window).height() - 60;
        $slimScrolls.height(wHeight);
        $('.sidebar .slimScrollDiv').height(wHeight);
        $(window).resize(function() {
            var rHeight = $(window).height() - 60;
            $slimScrolls.height(rHeight);
            $('.sidebar .slimScrollDiv').height(rHeight);
        });
    }

    // 비밀번호 토글 기능 (만약 toggle-password 클래스가 있다면)
    if ($('.toggle-password').length > 0) {
        $(document).on('click', '.toggle-password', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $(".pass-input");
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    // 전체 체크박스 클릭 이벤트 처리 (만약 check_all 아이디가 있다면)
    $(document).on('click', '#check_all', function() {
        $('.checkmail').click();
        return false;
    });

    // 개별 체크박스 클릭 이벤트 처리 (만약 checkmail 클래스가 있다면)
    if ($('.checkmail').length > 0) {
        $('.checkmail').each(function() {
            $(this).on('click', function() {
                $(this).closest('tr').toggleClass('checked');
            });
        });
    }

    // 메일 중요 표시 토글 (만약 mail-important 클래스가 있다면)
    $(document).on('click', '.mail-important', function() {
        $(this).find('i.fa').toggleClass('fa-star').toggleClass('fa-star-o');
    });

    // 사이드바 토글 버튼 클릭 이벤트 처리
    $(document).on('click', '#toggle_btn', function() {
        if ($('body').hasClass('mini-sidebar')) {
            $('body').removeClass('mini-sidebar');
            $('.subdrop + ul').slideDown();
        } else {
            $('body').addClass('mini-sidebar');
            $('.subdrop + ul').slideUp();
        }
        setTimeout(function() {}, 300);
        return false;
    });

    // 사이드바 확장/축소 기능 (마우스 오버 시)
    $(document).on('mouseover', function(e) {
        e.stopPropagation();
        if ($('body').hasClass('mini-sidebar') && $('#toggle_btn').is(':visible')) {
            var targ = $(e.target).closest('.sidebar').length;
            if (targ) {
                $('body').addClass('expand-menu');
                $('.subdrop + ul').slideDown();
            } else {
                $('body').removeClass('expand-menu');
                $('.subdrop + ul').slideUp();
            }
            return false;
        }
    });

    // 필터 검색 토글 (만약 filter_search 아이디가 있다면)
    $(document).on('click', '#filter_search', function() {
        $('#filter_inputs').slideToggle("slow");
    });

    // 채팅 창 관련 코드 (만약 chat-window 클래스가 있다면)
    var chatAppTarget = $('.chat-window');
    (function() {
        if ($(window).width() > 991)
            chatAppTarget.removeClass('chat-slide');
        $(document).on("click", ".chat-window .chat-users-list a.media", function() {
            if ($(window).width() <= 991) {
                chatAppTarget.addClass('chat-slide');
            }
            return false;
        });
        $(document).on("click", "#back_user_list", function() {
            if ($(window).width() <= 991) {
                chatAppTarget.removeClass('chat-slide');
            }
            return false;
        });
    })();


    document.oncontextmenu = function() {
        return false;
    };

    $(document).on('mousedown', function(e) {
        if (e.button == 2) {
            return false;
        }
        return true;
    });



})(jQuery);
