(function($) {

    var User = Backbone.Model.extend({
        initialize: function(name, symbol) {
            this.name = name;
            this.symbol = symbol
            this.score = 0;
            this.gamePoints = 0;
        },
        addPoint: function() {
            this.score = this.score + 1;
        },
        addGamePoints: function(num) {
            this.gamePoints = this.gamePoints + num;
        },
        emptyGamePoints: function() {
            this.gamePoints = 0;
        }
    });

    var TicTacToeView = Backbone.View.extend({
        moves: 0,
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

        gameStatus: [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ],

        points: [
            [1,8,64],
            [2,16,128],
            [4,32,256]
        ],

        wins: [7, 56, 448, 73, 146, 292, 273, 84],

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
            var self = this;
            this.addSymbolToBoard(cursorPos[0], cursorPos[1], this.currentPlayer, function() {
                self.moves++;

                if(self.isWin(self.currentPlayer.gamePoints)) {
                    alert(self.currentPlayer.name + ' Wins!');
                    self.currentPlayer.addPoint();
                    self.updateScore();
                    self.startNewGame();
                }
                if (self.moves == 9) {
                    alert('Draw Game!');
                    self.startNewGame();
                }

                self.switchPlayers();
            });
        },

        updateScore: function() {
            $('#player1-score').html(this.player1.score);
            $('#player2-score').html(this.player2.score);
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

        isWin: function(points) {
            for(var i=0;i<this.wins.length;i++) {
                if((this.wins[i] & points) === this.wins[i]) {
                    return true;
                }
            }
            return false;
        },

        startNewGame: function() {
            this.moves = 0;
            this.player1.emptyGamePoints();
            this.player2.emptyGamePoints();

            for(var i=0;i<3;i++) {
                for(var j=0;j<3;j++) {
                    this.gameStatus[i][j] = 0;
                }
            }

            $('#board-svg').html('');
            this.render();
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

        addSymbolToBoard: function(x, y, player, cb) {
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

            //check if spot already taken;
            if(this.gameStatus[boardPosX][boardPosY] !== 0) {
                return;
            }
            //update game status
            this.gameStatus[boardPosX][boardPosY] = player.symbol;

            //add game points to player
            player.addGamePoints(this.points[boardPosX][boardPosY]);

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
                cb();
            }, this);

        }

    });

    var ticTacToeView = new TicTacToeView();
})(jQuery);