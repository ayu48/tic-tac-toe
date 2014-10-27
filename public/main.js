(function($) {

    var User = Backbone.Model.extend({
        initialize: function(name, symbol) {
            this.name = name;
            this.symbol = symbol
            this.score = 0;
        },
        addPoint: function() {
            this.score =+ 1;
        }
    });

    var TicTacToeView = Backbone.View.extend({
        currentPlayer: null,
        player1: null,
        player2: null,
        sqrLength: 133,
        boardSvg: null,

        boardPositions: [
            [{x: 0, y: 0}, {x: 0, y: 140}, {x: 0, y: 280}],
            [{x: 140, y: 0}, {x: 140, y: 140}, {x: 140, y: 280}],
            [{x: 280, y: 0}, {x: 280, y: 140}, {x: 280, y: 280}]
        ],

        el: $('#content'),

        events: {
            'click #board-svg': 'positionSelected'
        },

        initialize: function() {
            this.player1 = new User('Player 1', 'o');
            this.player2 = new User('Player 2', 'x');
            this.currentPlayer = this.player1;
            this.render();
        },

        render: function() {
            this.boardSvg = Snap('#board-svg');

            Snap.load("./public/img/board.svg", function(f) {
                this.boardSvg.append(f);
            }, this);

            return this;
        },

        positionSelected: function(event) {
            var cursorPos = this.getCoordinates(event);
            this.addSymbolToBoard(cursorPos[0], cursorPos[1], this.currentPlayer);
            this.switchPlayers();
        },

        switchPlayers: function(event) {
            $('.current').removeClass('current');
            if (this.currentPlayer == this.player1) {
                $('#player2 .player-body').addClass('current');
                this.currentPlayer = this.player2;
            } else {
                $('#player1 .player-body').addClass('current');
                this.currentPlayer = this.player1;
            }

        },

        getCoordinates: function(event) {
            var posX = event.pageX;
            var posY = event.pageY;
            var imgPos = this.findPosition($('#board-svg')[0]);
            posX = posX - imgPos[0];
            posY = posY - imgPos[1];
            return [posX, posY];
        },

        findPosition: function(element) {
            for (var posX = 0, posY = 0; element; element = element.offsetParent) {
                posX += element.offsetLeft;
                posY += element.offsetTop;
            }
            return [posX, posY];
        },

        addSymbolToBoard: function(x, y, player) {
            var boardPosX = 0;
            var boardPosY = 0;
            var svgFile;

            //get x position
            while(x > ((boardPosX+1) * this.sqrLength)) {
                boardPosX++;
            }
            //get y position
            while(y > ((boardPosY+1) * this.sqrLength)) {
                boardPosY++;
            }
            //next insert position
            position = this.boardPositions[boardPosX][boardPosY];

            //get svg file
            if(player.symbol == "x") {
                svgFile = ("./public/img/x.svg");
            } else {
                svgFile = ("./public/img/c.svg");
            }

            Snap.load(svgFile, function(f) {
                $(f.node).attr({x:position.x, y: position.y, width: 120, height: 120});
                this.boardSvg.append(f);
            }, this);

        }

    });

    var ticTacToeView = new TicTacToeView();
})(jQuery);