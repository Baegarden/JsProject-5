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

const widget = new ListWidget()
widget.backgroundColor = new Color(bgColor, 1)
const backgroundStack = widget.addStack()
backgroundStack.layoutHorizontally()
const standingStack = backgroundStack.addStack()
standingStack.layoutVertically()
standingStack.size = new Size(160, 160)
const dummyStack = backgroundStack.addStack()
dummyStack.size = new Size(10, 160)
const scheduleStack = backgroundStack.addStack()
scheduleStack.layoutVertically()
scheduleStack.size = new Size(155, 160)

// 순위 코드 Start -----------------------------------------------------------------------------------------------
// "Premier League" Title
const headStack = standingStack.addStack()
const LeagueImage = await loadImage(`https://www.thesportsdb.com/images/media/league/banner/4m3g4s1520767740.jpg`)
const LeagueImagewidget = headStack.addImage(LeagueImage)
LeagueImagewidget.imageSize = new Size(153, 25)
headStack.setPadding(0, 0, 2, 0)

// 순위 데이터 얻기
const url = `https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/standings.json`
const req = new Request(url)
const res = await req.loadJSON()

// 순위 데이터 화면에 출력
const titleStack = standingStack.addStack()
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
        const teamStack = standingStack.addStack()
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

        const underStack = standingStack.addStack()
        underStack.size = new Size(153, 1)
        underStack.borderColor = new Color(underBarColor, underBarOpacity)
        underStack.borderWidth = 1
    }
}
// 순위 코드 End -----------------------------------------------------------------------------------------------

// 일정 코드 Start -----------------------------------------------------------------------------------------------
// MatchDay 데이터 얻기
const matchDayUrl=`https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/matchdaysOverview.json`
const req1 = new Request(matchDayUrl)
const matchDayJson = await req1.loadJSON()

// MyTeam의 NextMatch 데이터 얻기
let closeMatchHometeamName = ""
let closeMatchAwayteamName = ""
let closeMatchHometeamId = 0
let closeMatchAwayteamId = 0
let closeMatchMonth = 13
let closeMatchDay = 32
let closeMatchHours = 0
let closeMatchMinutes = 0
let closeMatchDayofTheWeek = 0
let isFindMatchday = 0

for(const matchday of matchDayJson.matchdays){
  const matchUrl=`https://api.onefootball.com/scores-mixer/v1/en/cn/matchdays/${matchday.id}`
  const req2 = new Request(matchUrl)
  const matchJson = await req2.loadJSON()
  
  for(const item of matchJson.kickoffs){
    for(const match of item.groups[0].matches){
      if (match.period != "FullTime" && (match.team_home.id == myTeamId || match.team_away.id == myTeamId)){
        const date = new Date(item.kickoff)
        closeMatchHometeamName = match.team_home.name
        closeMatchAwayteamName = match.team_away.name
        closeMatchHometeamId = match.team_home.id
        closeMatchAwayteamId = match.team_away.id
        closeMatchMonth = date.getMonth()
        closeMatchDay = date.getDate()
        closeMatchHours = date.getHours()
        closeMatchMinutes = date.getMinutes()
        closeMatchDayofTheWeek = date.getDay()
        isFindMatchday = 1
        break                
      }
    }
    if(isFindMatchday == 1)
      break
  }
  if(isFindMatchday == 1)
      break     
}  
const matchstadium = getMatchStadium(closeMatchHometeamName)

// MatchDay 날짜 출력
const matchDayTitle = scheduleStack.addStack()
matchDayTitle.size = new Size(155, 36)
matchDayTitle.setPadding(12, 0, 0, 0)               
let Hours = ""
let minutes = ""
if (closeMatchHours < 10)
  Hours = `0${closeMatchHours}`
else
  Hours = `${closeMatchHours}`
if (closeMatchMinutes < 10)
  minutes = `0${closeMatchMinutes}`
else
  minutes = `${closeMatchMinutes}`
const DayOfTheWeek = getDayOfTheWeek(closeMatchDayofTheWeek)
const a = matchDayTitle.addText(`${closeMatchMonth+1}.${closeMatchDay} ${DayOfTheWeek}  ${Hours}:${minutes}`)
a.font = Font.boldMonospacedSystemFont(12)
a.textColor = new Color(txColor, 1)
a.centerAlignText()

// MatchDay 팀정보 출력
const matchTeamTitleImage = scheduleStack.addStack()
matchTeamTitleImage.size = new Size(155, 36)
matchTeamTitleImage.layoutHorizontally()

const homeImageStack = matchTeamTitleImage.addStack()         // Hometeam Image
homeImageStack.size = new Size(70, 36)
homeImageStack.setPadding(6, 0, 0, 0)               
const homeTeamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${closeMatchHometeamId}.png`)
const homeImage = homeImageStack.addImage(homeTeamImage)      
homeImage.imageSize = new Size(30, 30)

const vsStack = matchTeamTitleImage.addStack()                // "VS"
vsStack.size = new Size(15, 36)
vsStack.setPadding(25, 0, 0, 0)               
vs = vsStack.addText("VS")
vs.font = Font.boldMonospacedSystemFont(10)
vs.textColor = new Color(txColor, 1)

const awayImageStack = matchTeamTitleImage.addStack()         // Away Image
awayImageStack.size = new Size(70, 36)
awayImageStack.setPadding(6, 0, 0, 0)               
const awayTeamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${closeMatchAwayteamId}.png`)
const awayImage = awayImageStack.addImage(awayTeamImage)      
awayImage.imageSize = new Size(30, 30)

const matchTeamTitleText = scheduleStack.addStack()
matchTeamTitleText.size = new Size(155, 36)

const hometeamNameStack = matchTeamTitleText.addStack()       // Hometeam Name
hometeamNameStack.size = new Size(70, 36)
hometeamNameStack.setPadding(5, 0, 0, 0)               
closeMatchHometeamName = enToKr(closeMatchHometeamName)               
hometeamName = hometeamNameStack.addText(closeMatchHometeamName)
hometeamName.font = Font.boldMonospacedSystemFont(14)
hometeamName.textColor = new Color(txColor, 1)

const dummy = matchTeamTitleText.addStack()               
dummy.size = new Size(15, 36)

const awayteamNameStack = matchTeamTitleText.addStack()       // Away Name
awayteamNameStack.size = new Size(70, 36)
awayteamNameStack.setPadding(5, 0, 0, 0)               
closeMatchAwayteamName = enToKr(closeMatchAwayteamName)               
awayteamName = awayteamNameStack.addText(closeMatchAwayteamName)
awayteamName.font = Font.boldMonospacedSystemFont(14)
awayteamName.textColor = new Color(txColor, 1)

// MatchDay 구장정보 출력
const matchstadiumTitle = scheduleStack.addStack()
matchstadiumTitle.size = new Size(155, 22)
const c = matchstadiumTitle.addText(matchstadium)
c.font = Font.boldMonospacedSystemFont(10)
c.textColor = new Color(txColor, 1)
c.centerAlignText()
// 일정 코드 End -----------------------------------------------------------------------------------------------

// 관련 함수
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

function enToKr(name) {
    if (name == "Liverpool")
      return "리버풀"
    else if (name == "Burnley")
      return "번리"
    else if (name == "Leeds United")
      return "리즈"
    else if (name == "Everton")
      return "에버턴"
    else if (name == "Crystal Palace")
      return "팰리스"
    else if (name == "Brentford")
      return "브렌트포드"
    else if (name == "Aston Villa")
      return "아스톤빌라"
    else if (name == "Newcastle United")
      return "뉴캐슬"
    else if (name == "Manchester City")
      return "맨시티"
    else if (name == "Norwich City")
      return "노리치"
    else if (name == "Brighton & Hove Albion")
      return "브라이튼"
    else if (name == "Watford")
      return "왓포드"
    else if (name == "Wolves")
      return "울버햄튼"
    else if (name == "Tottenham")
      return "토트넘"
    else if (name == "Southampton")
      return "사우샘프턴"
    else if (name == "Manchester United")
      return "맨유"
    else if (name == "Arsenal")
      return "아스널"
    else if (name == "Chelsea")
      return "첼시"
    else if (name == "West Ham")
      return "웨스트햄"
    else if (name == "Leicester City")
      return "레스터시티"
}
  
function getMatchStadium(homeTeam){
    if (homeTeam == "Liverpool")
        return "Anfield"
    else if (homeTeam == "Burnley")
        return "Turf Moor"
    else if (homeTeam == "Leeds United")
        return "Elland Road"
    else if (homeTeam == "Everton")
        return "Goodison Park"
    else if (homeTeam == "Crystal Palace")
        return "Selhurst Park"
    else if (homeTeam == "Brentford")
        return "Brentford Community Stadium"
    else if (homeTeam == "Aston Villa")
        return "Villa Park"
    else if (homeTeam == "Newcastle United")
        return "St. James' Park"
    else if (homeTeam == "Manchester City")
        return "Etihad Stadium"
    else if (homeTeam == "Norwich City")
        return "Carrow Road"
    else if (homeTeam == "Brighton & Hove Albion")
        return "American Express Community Stadium"
    else if (homeTeam == "Watford")
        return "Vicarage Road"
    else if (homeTeam == "Wolves")
        return "Molineux Stadium"
    else if (homeTeam == "Tottenham")
        return "Tottenham Hotspur Stadium"
    else if (homeTeam == "Southampton")
        return "St. Mary's Stadium"
    else if (homeTeam == "Manchester United")
        return "Old Trafford"
    else if (homeTeam == "Arsenal")
        return "Emirates Stadium"
    else if (homeTeam == "Chelsea")
        return "Stamford Bridge"
    else if (homeTeam == "West Ham")
        return "London Stadium"
    else if (homeTeam == "Leicester City")
        return "King Power Stadium"
}
  
function getDayOfTheWeek(day){
    if (day == 0)
        return "(일)"
    else if(day == 1)
        return "(월)"
    else if(day == 2)
        return "(화)"
    else if(day == 3)
        return "(수)"  
    else if(day == 4)
        return "(목)"
    else if(day == 5)
        return "(금)"
    else 
        return "(토)"
}

async function loadImage(imgUrl) {
    let req = new Request(imgUrl)
    let image = await req.loadImage()
    return image
}

Script.setWidget(widget)
Script.complete()