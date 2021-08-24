// 리그 설정
const id = "9"
const s = "39301"

// 브랜트포드:671 아스날:2 맨유:21 리즈:571 번리:275 브라이튼:670 첼시:9 크팰:567 에버턴:197 사우샘프턴:615
// 레스터:572 울버햄튼:203 왓포드:580 아스톤빌라:199 노리치:575 리버풀:18 뉴캐슬:207 웨스트햄:198 토트넘:202 맨시티:209
// MyTeam 설정
const myTeamId = "202"
let bgColor = "#FFFFFF"
let txColor = "#410648"

const widget = new ListWidget()
widget.backgroundColor = new Color(bgColor, 1)

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
const matchDayTitle = widget.addStack()
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
const matchTeamTitleImage = widget.addStack()
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

const matchTeamTitleText = widget.addStack()
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
const matchstadiumTitle = widget.addStack()
matchstadiumTitle.size = new Size(155, 22)
const c = matchstadiumTitle.addText(matchstadium)
c.font = Font.boldMonospacedSystemFont(10)
c.textColor = new Color(txColor, 1)
c.centerAlignText()

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