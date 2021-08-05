manager.init(function () {

    // 加一个方法阻止所有格子的点击事件
    let page1 = this.setPage('page1', 'center', function () {
            page1.hideAll();
            let result;
            let bombNumber = 10;
            let restFlag = 10;
            let totalTime = 0;
            let timer;
            let gridList = [];
            let firstClick = false;
            let gridMap = [];
            let flagCount = new Paragraph('剩余旗帜数：' + bombNumber, 35, 40, 250, 120, 300, 40);
            let timeCount = new Paragraph('时间：' + 0, 35, 40, 250, 180, 300, 40);
            page1.getChild('p_1_playAgain').visible = true;
            page1.getChild('p_1_playAgain').rect = [375, 1050, 122, 123];
            page1.setTouch('p_1_playAgain', () => {
                window.location.reload();
            });
            page1.addChild(flagCount);
            page1.addChild(timeCount);


            for (let i = 0; i < 9; i++) {
                let gridLine = [];
                for (let j = 0; j < 9; j++) {
                    let blueGrid = new Shape('p_1_blue', 'shape', page1);
                    blueGrid.name = 'p_1_blueGrid' + i + j;
                    blueGrid.rect = [151 + j * 56, 396 + i * 56, 48, 48];
                    gridLine.push(blueGrid)
                    page1.addChild(blueGrid);
                    let startTime;
                    page1.setTouch('p_1_blueGrid' + i + j, () => {
                        if (millis() - startTime > 300) {
                            // if (bombNumber <= 0) return;
                            if (gridList[i][j].name !== ('p_1_flag') && gridList[i][j].name !== ('p_1_questionMark')) {
                                gridList[i][j].visible = false;
                                let flag;
                                flagCount.text = '剩余旗帜数：' + --restFlag;
                                if (!page1.getChild('p_1_flag_' + i + j)) {
                                    flag = new Shape('p_1_flag', 'shape', page1);
                                    flag.name = 'p_1_flag_' + i + j;
                                    flag.rect = gridList[i][j].rect;
                                    page1.addChild(flag);
                                    console.log('flag again')
                                } else {
                                    flag = page1.getChild('p_1_flag_' + i + j);
                                    flag.visible = true;
                                }
                                flag.setTouch(() => {
                                    if (millis() - startTime > 300) {
                                        flag.visible = false;
                                        flagCount.text = '剩余旗帜数：' + ++restFlag;
                                        let qMark;
                                        if (!page1.getChild('p_1_questionMark_' + i + j)) {
                                            qMark = new Shape('p_1_questionMark', 'shape', page1)
                                            qMark.name = 'p_1_questionMark_' + i + j;
                                            qMark.rect = gridList[i][j].rect;
                                            page1.addChild(qMark);
                                            console.log('qMark again')
                                        } else {
                                            qMark = page1.getChild('p_1_questionMark_' + i + j);
                                            qMark.visible = true;
                                        }

                                        qMark.setTouch(() => {
                                            if (millis() - startTime > 300) {
                                                qMark.visible = false;
                                                gridList[i][j].visible = true;
                                            }
                                        }, false, () => {
                                            startTime = millis();
                                        })
                                    }
                                }, false, () => {
                                    startTime = millis();
                                })
                            }
                            return;
                        }
                        if (!firstClick) {
                            initGame(i, j);
                            firstClick = true;
                            return;
                        }
                        console.log(gridMap[i][j])
                        if (gridMap[i][j] === -1) {
                            clickBomb(i, j);

                        } else if (gridMap[i][j] === 0) {
                            clickEmptyGrid(i, j);
                            if (checkIsWin()) {
                                endGame();
                            }

                        } else if (gridMap[i][j] > 0 && gridMap[i][j] < 9) {
                            showGrid(i, j, 'p_1_num_' + gridMap[i][j]);
                            if (checkIsWin()) {
                                endGame();
                            }
                        }
                    }, false, () => {
                        startTime = millis();
                    })
                }
                gridList.push(gridLine);
            }

            let checkIsWin = () => {
                for (let i = 0; i < gridMap.length; i++) {
                    for (let j = 0; j < gridMap[i].length; j++) {
                        if (gridMap[i][j] !== -1 && !(gridList[i][j].visible && (gridList[i][j].name.startsWith('p_1_num_') || gridList[i][j].name.startsWith('p_1_white')))) {
                            return false;
                        }
                    }
                }
                result = 'victory';
                return true;
            }

            let endGame = () => {
                clearInterval(timer);
                for (let grid of page1.getChildrenByPref(['p_1_flag', 'p_1_questionMark', 'p_1_bomb', 'p_1_blueGrid'])) {
                    grid.setTouch(false, false, false);
                }

                if (result === 'victory') {
                    setTimeout(() => {
                        page1.getChild('p_1_victory').show();
                    }, 500)
                } else {
                    setTimeout(() => {
                        page1.getChild('p_1_defeat').show();
                    }, 500)
                }

            }

            let clickBomb = (x, y) => {
                for (let i = 0; i < gridMap.length; i++) {
                    for (let j = 0; j < gridMap[i].length; j++) {
                        if (gridMap[i][j] === -1) {
                            if (i === x && j === y) {
                                showGrid(i, j, 'p_1_selectedBomb');
                            } else if (page1.getChild('p_1_flag_' + i + j) && page1.getChild('p_1_flag_' + i + j).visible) {
                                page1.getChild('p_1_flag_' + i + j).visible = false;
                                showGrid(i, j, 'p_1_signedBomb', true);
                            } else {
                                if (page1.getChild('p_1_questionMark_' + i + j) && page1.getChild('p_1_questionMark_' + i + j).visible) {
                                    page1.getChild('p_1_questionMark_' + i + j).visible = false;
                                }
                                showGrid(i, j, 'p_1_bomb', true);
                            }
                        }
                    }
                }
                result = 'defeat'
                endGame();
            }

            let showGrid = (i, j, name, fade) => {
                gridList[i][j].visible = false;
                gridList[i][j] = new Shape(name, 'shape', page1);
                gridList[i][j].rect = [151 + j * 56, 396 + i * 56, 48, 48];
                page1.addChild(gridList[i][j]);
                if (fade) {
                    gridList[i][j].visible = false;
                    gridList[i][j].show();
                }
            }

            let initGame = (firstX, firstY) => {
                let bombNum = 0;

                for (let i = 0; i < 9; i++) {
                    gridMap[i] = [];
                    for (let j = 0; j < 9; j++) {
                        gridMap[i][j] = 0;
                    }
                }

                while (bombNum < bombNumber) {
                    let x = Math.floor(Math.random() * 7 + 1);
                    let y = Math.floor(Math.random() * 7 + 1);
                    if (gridMap[x][y] === -1 || (x === firstX && y === firstY)) continue;
                    gridMap[x][y] = -1;
                    bombNum++;
                }

                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (gridMap[i][j] === -1) continue;
                        let bombCount = 0;
                        let surround = getSurroundingGrid(i, j);
                        for (let item of surround) {
                            if (gridMap[item[0]][item[1]] === -1) {
                                bombCount++;
                            }
                        }
                        gridMap[i][j] = bombCount;
                    }
                }

                if (gridMap[firstX][firstY] === 0) {
                    clickEmptyGrid(firstX, firstY);
                } else {
                    showGrid(firstX, firstY, 'p_1_num_' + gridMap[firstX][firstY]);
                }
                console.log('init game')
                console.log(gridMap)
                timer = setInterval(() => {
                    totalTime++;
                    timeCount.text = '时间：' + totalTime;
                }, 1000)
            }

            let clickEmptyGrid = (i, j) => {
                if (gridMap[i][j] === 0 && gridList[i][j].name !== 'p_1_white') {
                    gridList[i][j].visible = false;
                    gridList[i][j] = new Shape('p_1_white', 'shape', page1);
                    gridList[i][j].rect = [151 + j * 56, 396 + i * 56, 48, 48];
                    page1.addChild(gridList[i][j]);
                    let surround = getSurroundingGrid(i, j);
                    for (let item of surround) {
                        clickEmptyGrid(item[0], item[1]);
                    }
                } else if (gridMap[i][j] > 0 && gridMap[i][j] < 9) {
                    showGrid(i, j, 'p_1_num_' + gridMap[i][j]);
                }

            }

            let getSurroundingGrid = (i, j) => {
                let surroundingGridList = [];
                let x = [-1, -1, -1, 0, 0, 1, 1, 1];
                let y = [-1, 0, 1, -1, 1, -1, 0, 1];

                for (let k = 0; k < 8; k++) {
                    if ((x[k] === -1 && i <= 0) || (x[k] === 1 && i >= gridMap.length - 1) || (y[k] === -1 && j <= 0) || (y[k] === 1 && j >= gridMap.length - 1)) continue;
                    surroundingGridList.push([i + x[k], j + y[k]]);
                }

                // if (i > 0 && j > 0) surroundingGridList.push([i - 1, j - 1]);
                // if (i > 0) surroundingGridList.push([i - 1, j]);
                // if (i > 0 && j < 8) surroundingGridList.push([i - 1, j + 1]);
                // if (j > 0) surroundingGridList.push([i, j - 1]);
                // if (j < 8) surroundingGridList.push([i, j + 1]);
                // if (i < 8 && j > 0) surroundingGridList.push([i + 1, j - 1]);
                // if (i < 8) surroundingGridList.push([i + 1, j]);
                // if (i < 8 && j < 8) surroundingGridList.push([i + 1, j + 1]);

                return surroundingGridList;
            }

            // let checkSurround = (i, j, numberList, mode) => {
            //     if (mode === 'count') {
            //         let count = 0;
            //         for (let number of numberList) {
            //             if (i > 0 && j > 0 && gridMap[i - 1][j - 1] && gridMap[i - 1][j - 1] === number) count++;
            //             if (i > 0 && gridMap[i - 1][j] && gridMap[i - 1][j] === number) count++;
            //             if (i > 0 && j < 8 && gridMap[i - 1][j + 1] && gridMap[i - 1][j + 1] === number) count++;
            //             if (j > 0 && gridMap[i][j - 1] && gridMap[i][j - 1] === number) count++;
            //             if (j < 8 && gridMap[i][j + 1] && gridMap[i][j + 1] === number) count++;
            //             if (i < 8 && j > 0 && gridMap[i + 1][j - 1] && gridMap[i + 1][j - 1] === number) count++;
            //             if (i < 8 && gridMap[i + 1][j] && gridMap[i + 1][j] === number) count++;
            //             if (i < 8 && j < 8 && gridMap[i + 1][j + 1] && gridMap[i + 1][j + 1] === number) count++;
            //         }
            //
            //         return count;
            //     }
            // }
        }
    );
    page1.show();

});