// 리그 설정
const id = "9"
const s = "39301"

// 브랜트포드:671 아스날:2 맨유:21 리즈:571 번리:275 브라이튼:670 첼시:9 크팰:567 에버턴:197 사우샘프턴:615
// 레스터:572 울버햄튼:203 왓포드:580 아스톤빌라:199 노리치:575 리버풀:18 뉴캐슬:207 웨스트햄:198 토트넘:202 맨시티:209
// MyTeam 설정
const myTeamId = "202" 
let myTeamColor = "#FFFF00"
let txColor = "#410648"
let logoColor = "#410648"
let highlightColor = "#410648"
let titleTxColor = "#FFFFFF"
let titleColor = "#410648"
let bgColor = "#FFFFFF"
let underBarColor = "#410648"
let underBarOpacity = 0.5

// "Premier League" Title
const widget = new ListWidget()
widget.backgroundColor = new Color(bgColor, 1)
const headStack = widget.addStack()
const LeagueImage = await loadImage(`https://www.thesportsdb.com/images/media/league/banner/4m3g4s1520767740.jpg`)
const LeagueImagewidget = headStack.addImage(LeagueImage)
LeagueImagewidget.imageSize = new Size(153, 25)
headStack.setPadding(0, 0, 2, 0)

// 순위 데이터 얻기
const url = `https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/standings.json`
const req = new Request(url)
const res = await req.loadJSON()

// 순위 데이터 화면에 출력
const titleStack = widget.addStack()
titleStack.layoutHorizontally()
titleStack.backgroundColor = new Color(titleColor, 1)
titleStack.cornerRadius = 3
titleStack.setPadding(5, 2, 0, 2)
createStack(titleStack, '순위', 25, 1)
createStack(titleStack, '팀', 14, 1)
createStack(titleStack, '경기', 25, 1)
createStack(titleStack, '승', 20, 1)
createStack(titleStack, '무', 20, 1)
createStack(titleStack, '패', 20, 1)
createStack(titleStack, '승점', 25, 1)

let myTeamRanking = 0
for (const item of res.groups[0].ranking){
    if(item.team.idInternal == myTeamId){
        myTeamRanking = item.index
        if(myTeamRanking < 3)
            myTeamRanking = 3
        else if(myTeamRanking > 18)
            myTeamRanking = 18
        break
    }
}

for (const item of res.groups[0].ranking){
    const ranking = item.index
    if(Math.abs(ranking - myTeamRanking) <= 2){
        const teamStack = widget.addStack()
        teamStack.layoutHorizontally()
        teamStack.setPadding(4, 0, 0, 0)

        // 순위, 구단명, 경기수, 승, 무, 패, 득실차
        const ranking = item.index
        const playedNum = item.team.teamstats.played
        const winNum = item.team.teamstats.won
        const drawNum = item.team.teamstats.drawn
        const loseNum = item.team.teamstats.lost
        const point = item.team.teamstats.points

        // 챔스권 팀 설정
        const clStack = teamStack.addStack()
        clStack.size = new Size(2, 14)
        clStack.cornerRadius = 2
        if (ranking <= 4)
            clStack.backgroundColor = new Color(highlightColor, 1)       
        // 강등권 팀 설정
        else if (ranking >= 18)
            clStack.backgroundColor = new Color(highlightColor, 1)

        createStack(teamStack, `${ranking}`, 25, 0)
        const teamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${item.team.idInternal}.png`)
        const teamImagewidget = teamStack.addImage(teamImage)
        teamImagewidget.imageSize = new Size(14, 14)
        createStack(teamStack, `${playedNum}`, 25, 0)
        createStack(teamStack, `${winNum}`, 20, 0)
        createStack(teamStack, `${drawNum}`, 20, 0)
        createStack(teamStack, `${loseNum}`, 20, 0)
        createStack(teamStack, `${point}`, 27, 0)

        // MyTeam 설정
        if(item.team.idInternal == myTeamId)
            teamStack.backgroundColor = new Color(myTeamColor, 0.2)

        const underStack = widget.addStack()
        underStack.size = new Size(153, 1)
        underStack.borderColor = new Color(underBarColor, underBarOpacity)
        underStack.borderWidth = 1
    }
}

function createStack(stack, text, width, isTitle) {
    const element = stack.addStack()
    element.size = new Size(width, 16)
    const elementText = element.addText(text)
    elementText.font = Font.mediumRoundedSystemFont(11)
    elementText.textColor = new Color(txColor, 1)
    if (isTitle == 1){
        elementText.textColor = new Color(titleTxColor, 1)
        elementText.font = Font.mediumRoundedSystemFont(10)
    }
}

async function loadImage(imgUrl) {
    let req = new Request(imgUrl)
    let image = await req.loadImage()
    return image
}

Script.setWidget(widget)
Script.complete()