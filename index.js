jQuery(document).ready(function () {
    jQuery('.login form').submit(function (event) {
        event.preventDefault();
        var username = jQuery(this).find('[name="username"]').val();
        var password = jQuery(this).find('[name="password"]').val();
        var data = JSON.stringify({
            username: username,
            password: password
        });
        jQuery.ajax({
            url: '/login',
            method: 'POST',
            data: data,
            success: function (data) {
                if (data.status === 'success') {
                    jQuery('.logout').attr('data-player-id', username);
                    jQuery('.ui.avatar').attr('src', data.player.avatar);
                    jQuery('.ui.list .name').html(data.player.name);

                    populateCategories();
                    populateGames();

                    jQuery('.login').hide();
                    jQuery('.casino').show();
                }
            }
        });
    });

    jQuery('.list.category.items').on('click', '.category.item', function (event) {
        event.stopPropagation();
        populateGames(jQuery(this).attr('data-category-id'));
    });

    function populateCategories () {
        jQuery.ajax({
            url: '/categories',
            method: 'POST',
            success: function (data) {
                if (data.length) {
                    var $categNode = undefined;
                    var $gridCategoryItemsList = jQuery('.ui.grid .list.category.items');
                    $gridCategoryItemsList.empty();
                    for (var i = 0; i < data.length; i++) {
                        $categNode = jQuery('<div class="category item" data-category-id="' + data[i].id + '"></div>');
                        $categNode.append('<div class="content"></div>');
                        $categNode.find('div').append('<div class="header">' + data[i].name + '</div>');
                        $gridCategoryItemsList.append($categNode);
                    }
                }
            }
        });
    }

    function populateGames () {
        var category = arguments.length ? arguments[0] : undefined;
        jQuery.ajax({
            url: '/games',
            method: 'POST',
            success: function (data) {
                if (data.length) {
                    var $gameNode = undefined;
                    var $gridGameItemsList = jQuery('.ui.grid .ui.relaxed.divided.game.items.links');
                    $gridGameItemsList.empty();
                    for (var i = 0; i < data.length; i++) {
                        if (category !== undefined && data[i].categoryIds.indexOf(parseInt(category)) === -1) {
                            continue;
                        }
                        $gameNode = jQuery('<div class="game item"></div>');
                        $gameNode.append('<div class="ui small image"><img src="' + data[i].icon + '" alt="game-icon" /></div>');
                        $gameNode.append('<div class="content"></div>');
                        $gameNode.find('div.content').append('<div class="header"><b class="name">' + data[i].name + '</b></div>');
                        $gameNode.find('div.content').append('<div class="description">' + data[i].description + '</div>');
                        $gameNode.find('div.content').append('<div class="extra"><div class="play ui right floated secondary button inverted">Play<i class="right chevron icon"></i></div></div>');
                        $gridGameItemsList.append($gameNode);
                    }
                }
            }
        });
    }

    jQuery('.logout').click(function (event) {
        event.preventDefault();
        var data = JSON.stringify({
            username: jQuery(this).attr('data-player-id')
        });
        jQuery.ajax({
            url: '/logout',
            method: 'POST',
            data: data,
            success: function (data) {
                console.log(data);
                if (data.status === 'success') {
                    jQuery('.login').show();
                    jQuery('.casino').hide();
                }
            }
        });
    });
});
