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

            // load tic-tac-toe board
            Snap.load("./public/img/board.svg", function(f) {
                this.boardSvg.append(f);
            }, this);

            return this;
        },

        positionSelected: function(event) {
            var cursorPos = this.getCursorPosition(event);
            var self = this;
            this.addMoveToBoard(cursorPos[0], cursorPos[1], function() {
                self.moves++;

                //check if its a winning move
                if(self.isWin(self.currentPlayer.gamePoints)) {
                    alert(self.currentPlayer.name + ' Wins!');
                    self.currentPlayer.addPoint();
                    self.updateScore();
                    self.startNewGame();
                }

                //check if out of moves
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

            //reset game status
            for(var i=0;i<3;i++) {
                for(var j=0;j<3;j++) {
                    this.gameStatus[i][j] = 0;
                }
            }

            //empty & render board
            $('#board-svg').html('');
            this.render();
        },

        getCursorPosition: function(event) {
            var posX = event.pageX;
            var posY = event.pageY;
            var boardPos = this.findBoardPosition();
            posX = posX - boardPos[0];
            posY = posY - boardPos[1];
            return [posX, posY];
        },

        findBoardPosition: function() {
            var element = $('#board-svg')[0];
            for (var posX = 0, posY = 0; element; element = element.offsetParent) {
                posX += element.offsetLeft;
                posY += element.offsetTop;
            }
            return [posX, posY];
        },

        addMoveToBoard: function(x, y, cb) {
            var squarePos = this.getSquareCoordinates(x, y);
            var svgFile;

            //check if spot already taken;
            if(this.spotAlreadyTaken(squarePos.x, squarePos.y)) {
                return;
            }
            //update game status
            this.gameStatus[squarePos.x][squarePos.y] = this.currentPlayer.symbol;

            //add game points to player
            this.currentPlayer.addGamePoints(this.points[squarePos.x][squarePos.y]);

            //next insert position
            var position = this.boardPositions[squarePos.x][squarePos.y];

            //get svg file
            if(this.currentPlayer.symbol == "x") {
                svgFile = ("./public/img/x.svg");
            } else {
                svgFile = ("./public/img/c.svg");
            }

            Snap.load(svgFile, function(f) {
                $(f.node).attr({x:position.x, y: position.y, width: 120, height: 120});
                this.boardSvg.append(f);
                cb();
            }, this);

        },

        spotAlreadyTaken: function(x, y) {
            return this.gameStatus[x][y] !== 0;
        },

        getSquareCoordinates: function(x, y) {
            var boardPosX = 0;
            var boardPosY = 0;

            //get x position
            while(x > ((boardPosX+1) * this.sqrLength)) {
                boardPosX++;
            }
            //get y position
            while(y > ((boardPosY+1) * this.sqrLength)) {
                boardPosY++;
            }
            return {x: boardPosX, y: boardPosY};
        }

    });

    var ticTacToeView = new TicTacToeView();
})(jQuery);