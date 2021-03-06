'use strict';

jQuery(document).ready(function () {
    var $mainContainer = jQuery('.main.container');
    var gameList = [];

    jQuery('.login form').submit(function (event) {
        event.preventDefault();
        var username = jQuery(this).find('[name="username"]').val();
        jQuery.ajax({
            url: '/login',
            method: 'POST',
            data: {
                username: jQuery(this).find('[name="username"]').val(),
                password: jQuery(this).find('[name="password"]').val()
            },
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

    function populateCategories() {
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

    function populateGames() {
        var category = arguments.length ? arguments[0] : undefined;
        var searchResult = arguments.length >= 2 ? arguments[1] : undefined;
        jQuery.ajax({
            url: '/games',
            method: 'POST',
            success: function (data) {
                if (data.length) {
                    // Save gameList for search purposes, do it only once.
                    if (!gameList.length) {
                        gameList = data;
                    }

                    var $gameNode = undefined;
                    var $gridGameItemsList = jQuery('.ui.grid .ui.relaxed.divided.game.items.links');
                    $gridGameItemsList.empty();
                    for (var i = 0; i < data.length; i++) {
                        if (category !== undefined && data[i].categoryIds.indexOf(parseInt(category)) === -1) {
                            continue;
                        }
                        if (searchResult !== undefined && searchResult.length && searchResult.indexOf(i) === -1) {
                            continue;
                        }
                        $gameNode = jQuery('<div class="game item"></div>');
                        $gameNode.append('<div class="ui small image"><img src="' + data[i].icon + '" alt="game-icon" /></div>');
                        $gameNode.append('<div class="content"></div>');
                        $gameNode.find('div.content').append('<div class="header"><b class="name">' + data[i].name + '</b></div>');
                        $gameNode.find('div.content').append('<div class="description">' + data[i].description + '</div>');
                        $gameNode.find('div.content').append('<div class="extra"><div data-game-code="' + data[i].code + '" ' +
                            'class="play ui right floated secondary button inverted">Play<i class="right chevron icon"></i></div></div>');
                        $gridGameItemsList.append($gameNode);
                    }
                }
            }
        });
    }

    jQuery('.logout').click(function (event) {
        event.preventDefault();
        jQuery.ajax({
            url: '/logout',
            method: 'POST',
            data: {
                username: jQuery(this).attr('data-player-id')
            },
            success: function (data) {
                console.log(data);
                if (data.status === 'success') {
                    jQuery('.login').show();
                    jQuery('.casino').hide();
                }
            }
        });
    });

    jQuery('.casino').on('click', '.play.button', function (/* event */) {
        $mainContainer.find('> div').hide();
        $mainContainer.find('.ingame').show();
        comeon.game.launch(jQuery(this).attr('data-game-code'));
    });

    jQuery('.ingame .button').click(function () {
        $mainContainer.find('> div').hide();
        $mainContainer.find('.casino').show();
    });

    jQuery('.search.ui input').keyup(function (event) {
        event.preventDefault();
        var searchTerm = new RegExp(jQuery(this).val(), 'i');
        var autoComplete = {
            run: function (games, searchTerm) {
                var searchResult = [];
                for (var i = 0; i < games.length; i++){
                    if (searchTerm.test(games[i].name)) {
                        searchResult.push(i);
                    }
                    populateGames(undefined, searchResult);
                }
            },
            setup: function (games, searchTerm) {
                if (typeof this.timer === 'number') {
                    this.cancel();
                }
                this.timer = setTimeout(function (games, searchTerm) {
                    this.run(games, searchTerm);
                }.bind(this), 1000, games, searchTerm);
            },
            cancel: function () {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
        };

        gameList.length && autoComplete.setup(gameList, searchTerm);
    });
});
