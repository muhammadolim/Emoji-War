$(document).ready(function () {

    ///// sounds
    var soundPunch = document.getElementById('sound-punch')
    var soundCocking = document.getElementById('sound-cocking')
    var soundDing = document.getElementById('sound-ding')

    /////////////////////////////// inputs ///////////////////////////////

    ///// functions

    function addBtn() {
        if ($('input').length < 12) {
            $('#input-example').clone().appendTo('#players-input').removeClass('d-none').removeAttr('id')
            $('input:last').focus()
        }
    }

    function removeBtn() {
        if ($('.remove-btn').length > 2) {
            $(this).parent().parent().remove()
        }
        areInputsAlright()
    }

    function enter(e) {
        if (e.keyCode == 13) {
            $('#add-btn').click()
        }
    }

    function areInputsAlright() {
        var inputs = document.querySelectorAll('input')

        for(input of inputs){
            if ($(input).val().length > 0) {
                inputsAlright = true
                break
            } else {
                inputsAlright = false
            }
        }
    }

    ///// events

    var inputsAlright = false

    addBtn()

    $('input').not('#input-example').on('input', function () {
        areInputsAlright()
    })

    $('input').focus().keypress(function (e) {
        enter(e)
    })

    $('#add-btn').click(function () {
        addBtn()

        $('.remove-btn').click(removeBtn)

        $('input').keypress(function (e) {
            enter(e)
        }).on('input', function () {
            areInputsAlright()
        })
    })



    /////////////////////////////// set teams ///////////////////////////////

    // set libraries for randoms
    var emoji = ['angry', 'freezing', 'grinning', 'mask', 'money', 'nerd', 'neutral', 'pleading', 'pouting', 'sunglasses', 'unamused']
    var teamNames = ['Alpha', 'Avengers', 'Bad Boys', 'Champions', 'Cowboys', 'End Game', 'Good Boys', 'Killers', 'Kingsmen', 'Masters', 'Mission Impossible', 'No Fear', 'No Rules', 'Soldiers', 'Terminators', 'Unknowns', 'Unstoppables', 'Warriors', 'Zombies']

    var countBattle = 0

    $('#circle-btn').click(function () {
        if ($(this).html() == 'fight!') {

            // start first battle
            battle($(`.battle:nth-child(${countBattle + 1}) .team-1`), $(`.battle:nth-child(${countBattle + 1}) .team-2`))
            countBattle++

            // fight btn remove
            $(this).remove()
        }
        else if (inputsAlright) {

            soundCocking.play()

            // set teams btn => figth btn
            $(this).html('fight!').css({
                'border': '3px solid red',
                'color': 'red'
            })
            // disable inputs
            $('#players-area .row').css({
                'pointer-events': 'none',
                'opacity': '.7'
            })

            // set player names
            var players = []

            $('input').each(function () {
                if ($(this).val() != '') {
                    players.push($(this).val())
                }
            })

            // should bot included
            var hasBot = false

            if (players.length % 2 == 1) {
                hasBot = true
                players.push('Bot')
            }

            // some parameters
            battlesQuantity = players.length / 2

            var rTeamName, rPlayerName, rEmoji, rHealth, rDamage

            // set team names
            for (let i = 0; i < 2; i++) {
                rTeamName = Math.floor(Math.random() * (teamNames.length))
                $(`#team-names .team-${i + 1}`).html(teamNames[rTeamName])
                teamNames.splice(rTeamName, 1)
            }

            for (let i = 0; i < battlesQuantity; i++) {

                // add battle
                $('#battle-example').clone().appendTo('#battles').removeClass('d-none').removeAttr('id')

                // set indicators
                for (let j = 0; j < 2; j++) {

                    // set randoms
                    rPlayerName = Math.floor(Math.random() * (players.length - 1))
                    rEmoji = Math.floor(Math.random() * (emoji.length))
                    rHealth = Math.floor(Math.random() * 20 + 4)
                    rDamage = Math.floor(Math.random() * 5 + 2)

                    // set player names
                    $(`.battle:last .team-${j + 1} .name`).html(players[rPlayerName])
                    players.splice(rPlayerName, 1)

                    // set emoji
                    $(`.battle:last .team-${j + 1} .emoji-img`).attr('src', `img/${emoji[rEmoji]}.png`)
                    emoji.splice(rEmoji, 1)

                    // set health and damages
                    switch (j) {
                        case 0:
                            for (let k = 0; k < rHealth; k++) {
                                $(`.battle:last .team-${j + 1} .health`).append('<div class="div">')
                            }
                            for (let k = 0; k < rDamage; k++) {
                                $(`.battle:last .team-${j + 1} .damage`).append('<div class="div">')
                            }
                            break
                        case 1:
                            for (let k = 0; k < rHealth; k++) {
                                $(`.battle:last .team-${j + 1} .health`).prepend('<div class="div">')
                            }
                            for (let k = 0; k < rDamage; k++) {
                                $(`.battle:last .team-${j + 1} .damage`).prepend('<div class="div">')
                            }
                            break
                        default:
                            break
                    }
                }
            }

            // set bot
            if (hasBot) {
                $('.battle:last .team-2 .emoji-img').attr('src', 'img/bot.png')
            }

            // remove battle base
            $('#battle-example').remove()
        }
        // if inputs are null
        else {
            alert('Enter players!')
        }
    })



    /////////////////////////////// fight ///////////////////////////////

    // team scores
    var firstTeamScore = 0
    var secondTeamScore = 0

    // battle
    function battle(team1, team2) {

        // setting details
        var emoji1 = $(team1).find('.emoji-img')
        var emoji2 = $(team2).find('.emoji-img')

        var health1 = $(team1).find('.health')
        var health2 = $(team2).find('.health')

        var playerName1 = $(team1).find('.name')
        var playerName2 = $(team2).find('.name')

        var damage1Len = $(team1).find('.damage div').length
        var damage2Len = $(team2).find('.damage div').length

        var firstPlayerWins = false
        var secondPlayerWins = false

        var hit = false
        var i = 0
        var j = 0

        // repeat every 0.01 seconds
        var interval = setInterval(() => {
            if (hit) {
                j -= 3
                if (j < 200) {
                    hit = false
                }

                if (i == 360) {
                    i = 0
                } else {
                    i -= 3
                }
            }
            else {
                j += 5

                if (i == 360) {
                    i = 0
                } else {
                    i += 5
                }

                // when hit happens
                if ($(emoji1).offset().left - $(emoji2).offset().left > -100) {

                    hit = true
                    soundPunch.cloneNode(true).play()

                    // health decreases
                    for (let i = 0; i < damage1Len; i++) {
                        $(health2).find('.div:first').addClass('injured-div').removeClass('div')
                    }
                    for (let i = 0; i < damage2Len; i++) {
                        $(health1).find('.div:last').addClass('injured-div').removeClass('div')
                    }

                    // when first player dies - second player wins
                    if ($(health1).children().first().hasClass('injured-div')) {
                        $(team1).animate({ opacity: .5 })

                        secondPlayerWins = true
                        secondTeamScore++
                    }
                    // when second player dies - first player wins
                    if ($(health2).children().last().hasClass('injured-div')) {
                        $(team2).animate({ opacity: .5 })

                        firstPlayerWins = true
                        if(!secondPlayerWins){
                            firstTeamScore++
                        }
                        // when both players die - both players win
                        else {
                            secondTeamScore--
                        }
                    }
                    // when either players die
                    if ($(health1).children().first().hasClass('injured-div') || $(health2).children().last().hasClass('injured-div')) {

                        // write notes
                        $('#notes-area').append(`<p> - `)
                        $('#notes-area').children().last().prepend(`<span>${$(playerName1).html()}`)
                        $('#notes-area').children().last().append(`<span>${$(playerName2).html()}`)

                        // color names on notes
                        if (firstPlayerWins && !secondPlayerWins) {
                            $('#notes-area p:last span:first').css('color', 'mediumblue')
                        } else if (!firstPlayerWins && secondPlayerWins) {
                            $('#notes-area p:last span:last').css('color', 'purple')
                        }

                        // next battle
                        if (countBattle < battlesQuantity) {
                            setTimeout(() => {
                                // start new battle
                                battle($(`.battle:nth-child(${countBattle + 1}) .team-1`), $(`.battle:nth-child(${countBattle + 1}) .team-2`))
                                countBattle++
                            }, 1500)
                        }
                        // when all battles are finished
                        else {

                            // team scores
                            $('#notes-area').append(`<p>${firstTeamScore} - ${secondTeamScore}`)
                                .children().last().css({ 'font-size': '40px', 'margin': '20px 0' })

                            setTimeout(() => {
                                soundDing.play()

                                // if first team wins
                                if (firstTeamScore > secondTeamScore) {
                                    $('#notes-area').append(`<p>${$('#team-names .team-1').html()}<br> win!`)
                                        .children().last().css('color', 'mediumblue').animate({ fontSize: '40px' }, 1000)
                                }
                                // if second team wins
                                else if (firstTeamScore < secondTeamScore) {
                                    $('#notes-area').append(`<p>${$('#team-names .team-2').html()}<br> win!`)
                                        .children().last().css('color', 'purple').animate({ fontSize: '40px' }, 1000)
                                }
                                // if it is draw
                                else {
                                    $('#notes-area').append(`<p>draw!`)
                                        .children().last().animate({ fontSize: '60px' }, 1000)
                                }
                            }, 1000)
                        }

                        // stop this battle
                        setTimeout(() => {
                            clearInterval(interval)
                        }, 200)
                    }
                }
            }

            // rolling emoji
            $(emoji1).css('transform', `rotate(${i}deg)`)
            $(emoji1).parent().css('transform', `translateX(${j}px)`)

            $(emoji2).css('transform', `rotate(${-i}deg)`)
            $(emoji2).parent().css('transform', `translateX(${-j}px)`)
        }, 10)
    }
})
