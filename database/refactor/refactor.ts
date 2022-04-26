import { writeFile } from "fs"

const words = [
    {"_id":{"$oid":"621867548f165cbc1781a549"},"createdAt":{"$date":"2022-02-25T05:21:24.559Z"},"updatedAt":{"$date":"2022-02-25T05:22:35.181Z"},"name":"Liquify into puddle on the floor","user":null,"meaning":"Feel overwhelmed due to a strong, often nice, emotion","synonyms":["n/a"],"tags":["Meet You in the Middle"],"sentences":["His velvety chocolate sex voice nearly liquifies me into a puddle on the floor."],"types":["Metaphor"],"__v":null},
    {"_id":{"$oid":"621860958f165cbc1781a548"},"createdAt":{"$date":"2022-02-25T04:52:37.951Z"},"updatedAt":{"$date":"2022-02-25T04:52:37.951Z"},"name":"Charged","user":null,"meaning":"Filled with excitement, tension or emotion","synonyms":["Intense"],"tags":["Meet You in the Middle"],"sentences":["The highly charged atmosphere created by the boycott.","My mom breaks the charged silence by asking him about his favorite food item.","We stare across the desk at each other in charged silence."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"62159fae5d53a5356814cd5a"},"createdAt":{"$date":"2022-02-23T02:45:01.991Z"},"updatedAt":{"$date":"2022-02-23T02:45:01.991Z"},"name":"Cough Up","user":null,"meaning":"Give something reluctantly, especially money or other information that is due or required","synonyms":["Fork over","Pay up","Shell out"],"tags":["Reddit","Informal"],"sentences":["Should I cough up the 200$ or can I have my cake and eat it too?","He coughed up the monthly subscription fee to continue with the service."],"types":["Phrasal Verb"],"__v":null},
    {"_id":{"$oid":"62153bbb6375451e3780c334"},"createdAt":{"$date":"2022-02-22T19:38:35.589Z"},"updatedAt":{"$date":"2022-02-22T19:38:35.589Z"},"name":"Bustling around","user":null,"meaning":"To move in a hurried way because often the person is busy","synonyms":["Scuttle"],"tags":["Meet You in the Middle"],"sentences":["Bustling around the kitchen.","Because her relatives are coming to visit, Annabelle is bustling around the house cleaning the whole house."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"62142ce0b37f53ab01cf779c"},"createdAt":{"$date":"2022-02-22T00:22:56.857Z"},"updatedAt":{"$date":"2022-02-22T00:22:56.857Z"},"name":"Painstaking","user":null,"meaning":"Done with or employing great care or thoroughness","synonyms":["Fastidiously","Meticulously","Carefully","Dilligently"],"tags":["Meet You in the Middle"],"sentences":["Painstaking attention to detail.","It took months of painstaking work to land this job.","Forensic experts carried out a painstaking search of the debris."],"types":["Adverb"],"__v":null},
    {"_id":{"$oid":"62142b48b37f53ab01cf779b"},"createdAt":{"$date":"2022-02-22T00:16:08.617Z"},"updatedAt":{"$date":"2022-02-22T00:16:08.617Z"},"name":"Stooge","user":null,"meaning":" A person who serves merely to support or assist others","synonyms":["Sidekick","Underling","Minion","Henchman"],"tags":["The Good Place","Derogatory"],"sentences":["He seems more like a stooge than a master criminal.","I always wanted to be perfect at something. I just never thought that I'd be the perfect stooge."],"types":["Noun"],"__v":null},
    {"_id":{"$oid":"621428e1b37f53ab01cf779a"},"createdAt":{"$date":"2022-02-22T00:05:53.787Z"},"updatedAt":{"$date":"2022-02-22T00:05:53.787Z"},"name":"Falacious","user":null,"meaning":"Based on mistaken belief","synonyms":["Erroneous","Incorrect","False","Untrue"],"tags":["Big Bang Theory"],"sentences":["Your characterization of the situation as typical is falacious.","Fallacious arguments.","Fallacious ideas shouldn't be allowed to spread unchecked."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"6213289a2a048ec6d611e763"},"createdAt":{"$date":"2022-02-21T05:52:26.724Z"},"updatedAt":{"$date":"2022-02-21T05:52:26.724Z"},"name":"Above board","user":null,"meaning":"legitimate, honest and open","synonyms":["Honest","Fair","Open","Frank"],"tags":["Meet You in the Middle"],"sentences":["We felt the judging was all above board and honest.","Let's play 20 questions. I promise to be above board with you.","The accountants acted completely above board."],"types":["Adjective","Adverb"],"__v":null},
    {"_id":{"$oid":"620f1537ef0e08b3047088bc"},"createdAt":{"$date":"2022-02-18T03:40:39.848Z"},"updatedAt":{"$date":"2022-02-19T20:23:27.384Z"},"name":"Flamboyant","user":null,"meaning":"Tending to attract attention because of their exuberance, confidence, and stylishness","synonyms":["Ostentatious","Catchy","Exuberant","Lively"],"tags":["Meet You in the Middle"],"sentences":[" flamboyant display of arobatics.","I'm wearing flamboyant footwear, usually with some type of embelishment.","I like to wear my flamboyant blazer with scissors lapel pins. It always makes for great conversations.","A flamboyant performer."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"620f13f3ef0e08b3047088bb"},"createdAt":{"$date":"2022-02-18T03:35:15.347Z"},"updatedAt":{"$date":"2022-02-18T03:35:15.347Z"},"name":"Dispassionate","user":null,"meaning":"Not influenced by strong emotion, and so able to be rational and impartial","synonyms":["Objective","Composed"],"tags":["Reddit"],"sentences":["She dealt with life's disasters in a calm, dispassionate way","We cannot have a rational dispassionate discourse here if you are gonna throw the topline figure and pearl at clutches every time."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"620f12fbef0e08b3047088ba"},"createdAt":{"$date":"2022-02-18T03:31:07.138Z"},"updatedAt":{"$date":"2022-02-18T03:31:07.138Z"},"name":"Behemoth","user":null,"meaning":"A huge or monstrous creature, something enormous","synonyms":["Enormous"],"tags":["Meet You in the Middle"],"sentences":["Behemoths like the Bronstosaurus.","The mental image of this muscle-bound behemoth hunched over a calculator is so incongruent."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"61fed5c86b54c4770de8881a"},"createdAt":{"$date":"2022-02-05T19:53:44.766Z"},"updatedAt":{"$date":"2022-02-17T02:17:00.349Z"},"name":"Aberrant","user":null,"meaning":"Departing from an accepted standard","synonyms":["Deviant","Abnormal","Atypical","Odd","Peculiar"],"tags":["Manifest"],"sentences":["This somewhat aberrant behavior requires an explanation.","We're not compromising our study for an aberrant case."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"61fed5196b54c4770de88819"},"createdAt":{"$date":"2022-02-05T19:50:49.734Z"},"updatedAt":{"$date":"2022-02-05T19:50:49.734Z"},"name":"Out of Place","user":null,"meaning":"In a setting where one is or feels inappropriate or incongruous","synonyms":["Inappropriate","Unsuitable"],"tags":["The Tinder Swindler"],"sentences":["The glamorous woman seemed radically out of place in the launderette.","This hotel is so out of my place.","Clubs are kind of out of place."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61fed4926b54c4770de88818"},"createdAt":{"$date":"2022-02-05T19:48:34.536Z"},"updatedAt":{"$date":"2022-02-05T19:48:34.536Z"},"name":"Nip It in the Bud","user":null,"meaning":"Suppress or destroy something at an early stage","synonyms":["Suppressed","Curtailed","Thwarted"],"tags":["Manifest"],"sentences":["The idea has been nipped in the bud at the local level.","I'll inject more fluids into his IV and try to nip it in the bud.","The policy regarding making some damming changes to the status of F-1 visa students has been nipped in the bud without reaching Trump's ears."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61fed3f16b54c4770de88817"},"createdAt":{"$date":"2022-02-05T19:45:53.783Z"},"updatedAt":{"$date":"2022-02-05T19:45:53.783Z"},"name":"Fissure","user":null,"meaning":"A long, narrow opening or line of breakage made by cracking or splitting, especially in rock or earth","synonyms":["Opening","Crevice"],"tags":["Manifest"],"sentences":["I dropped the Noah's ark in the fissure upstate that opened up as a result of high seismic activities caused due to our testing.","The dry years had cracked and fissured the cliffs."],"types":["Noun","Verb"],"__v":null},
    {"_id":{"$oid":"61fc7015a07454bdce48cbc5"},"createdAt":{"$date":"2022-02-04T00:15:17.413Z"},"updatedAt":{"$date":"2022-02-04T00:20:54.279Z"},"name":"Flip Someone's Lid","user":null,"meaning":"to become crazy or very angry","synonyms":["Blow Someone's Stack","Flip Out"],"tags":["Reddit"],"sentences":["His mother would flip her lid if she saw what a mess he'd made.","Some people will flip their lids no matter what the metrics are."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61fc5ae26506f2d3412fb44a"},"createdAt":{"$date":"2022-02-03T22:44:50.141Z"},"updatedAt":{"$date":"2022-02-04T00:10:53.033Z"},"name":"Rap Sheet","user":null,"meaning":"A criminal Record","synonyms":["n/a"],"tags":["Manifest","Informal","US"],"sentences":["He had not joined a gang or acquired a rap sheet.","How did my buttoned up brother rack up a rap sheet like this, I don't get it!"],"types":["Noun"],"__v":null},
    {"_id":{"$oid":"61fc5a696506f2d3412fb449"},"createdAt":{"$date":"2022-02-03T22:42:49.214Z"},"updatedAt":{"$date":"2022-02-03T22:42:49.214Z"},"name":"Wild Goose Chase","user":null,"meaning":"A foolish and hopeless pursuit of something unattainable","synonyms":["n/a"],"tags":["Manifest"],"sentences":["Physicists searching for the hypothetical particle may be on a wild goose chase.","Public health officials waiting for COVID to be eliminated to drop the restrictions are honestly on a wild goose chase."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61fa790213437acd4791f30a"},"createdAt":{"$date":"2022-02-02T12:28:50.506Z"},"updatedAt":{"$date":"2022-02-02T12:28:50.506Z"},"name":"Slick","user":null,"meaning":"Smooth or superficially impressive but insincere or shallow","synonyms":["Smooth","Neat","Fluent"],"tags":["David Pakman Show"],"sentences":["The brands are backed by slick advertising.","Peter Doocey's comebacks are slicker."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"61fa77c013437acd4791f309"},"createdAt":{"$date":"2022-02-02T12:23:28.936Z"},"updatedAt":{"$date":"2022-02-02T12:23:28.936Z"},"name":"Dredge","user":null,"meaning":"Clean out the bed of (a river, harbor or other area of water) by scooping out mud, weeds and rubbish with a dredge","synonyms":["n/a"],"tags":["Manifest"],"sentences":["The lower stretch of the river has been dredged.","They dredged the tailfin out of the ocean."],"types":["Verb","Noun"],"__v":null},
    {"_id":{"$oid":"61fa765b13437acd4791f308"},"createdAt":{"$date":"2022-02-02T12:17:31.912Z"},"updatedAt":{"$date":"2022-02-02T12:17:31.912Z"},"name":"Going rogue","user":null,"meaning":"Behaving erratically or dangerously, especially by disregarding the rules or usual way of doing things","synonyms":["n/a"],"tags":["Manifest"],"sentences":["Now is not the time to go rogue.","Leaders going rogue at press conferences can mean you have a serious problem."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61fa75dc13437acd4791f307"},"createdAt":{"$date":"2022-02-02T12:15:24.917Z"},"updatedAt":{"$date":"2022-02-02T12:15:24.917Z"},"name":"Run interference","user":null,"meaning":"Intervene on behalf of someone, typically so as to protect them from annoyance or distraction","synonyms":["n/a"],"tags":["Manifest","US","Informal"],"sentences":["Elizabeth was quick to run interference and said that the professor would be very busy.","I need you to run interference."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61f363d9da511d7c06c2c3e1"},"createdAt":{"$date":"2022-01-28T03:32:41.943Z"},"updatedAt":{"$date":"2022-01-28T03:32:41.943Z"},"name":"Bury the Hatchet","user":null,"meaning":"End a quarrel or conflict and become friendly","synonyms":["n/a"],"tags":["Meet You in the Middle"],"sentences":["After months of not talking to each other, me and Hannah finally burried the hatchet.","If I were you, I'd bury the hatchet.","The two countries decided to finally bury the hatchet."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61f362f6da511d7c06c2c3e0"},"createdAt":{"$date":"2022-01-28T03:28:54.173Z"},"updatedAt":{"$date":"2022-01-28T03:28:54.173Z"},"name":"Clandestine","user":null,"meaning":"Kept secret or done secretively, especially because illicit","synonyms":["Shady","Covert","Secret","Furtive"],"tags":["Meet You in the Middle"],"sentences":["She deserved better than these clandestine meetings.","This dim litted bar seems like the place where all these clandestine activities would go down."],"types":["Adjective"],"__v":null},
    {"_id":{"$oid":"61f36207da511d7c06c2c3df"},"createdAt":{"$date":"2022-01-28T03:24:55.591Z"},"updatedAt":{"$date":"2022-01-28T03:24:55.592Z"},"name":"Slink off","user":null,"meaning":"Depart furtively","synonyms":["n/a"],"tags":["Meet You in the Middle"],"sentences":["The shoplifter slipped an item into his coat and slunk away.","After that scolding, she slunk away.","Ben gave him a very intimidating look and snarled at him, and he slinked off."],"types":["Phrasal Verb"],"__v":null},
    {"_id":{"$oid":"61f32adbec47cf77e844f89e"},"createdAt":{"$date":"2022-01-27T23:29:31.888Z"},"updatedAt":{"$date":"2022-01-27T23:29:52.321Z"},"name":"Shoehorn","user":null,"meaning":"force into an inadequate space","synonyms":["n/a"],"tags":["Inovalon"],"sentences":["People were shoehorned into cramped corners."],"types":["Verb"],"__v":null},
    {"_id":{"$oid":"61f3126893671cccc094dcc1"},"createdAt":{"$date":"2022-01-27T21:45:12.511Z"},"updatedAt":{"$date":"2022-01-27T21:45:12.511Z"},"name":"Strained","user":null,"meaning":"Force (a part of one's body or oneself) to make a strenuous or unusually great effort","synonyms":["struggle"],"tags":["Let the Sparks Fly"],"sentences":["I stopped and listened, straining my ears for any sound."],"types":["Verb"],"__v":null},
    {"_id":{"$oid":"61f30f2893671cccc094dcc0"},"createdAt":{"$date":"2022-01-27T21:31:20.369Z"},"updatedAt":{"$date":"2022-01-27T21:31:20.369Z"},"name":"Squirrel away","user":null,"meaning":"To put something in a safe or secret place especially so that it can be kept for future use","synonyms":["n/a"],"tags":["Let the Sparks Fly"],"sentences":["Most of his money is squirelled away somewhere.","As I flip the page and squirrel away all of my memories and experiences, I'd like to wish everyone a happy new year!"],"types":["Phrasal Verb"],"__v":null},
    {"_id":{"$oid":"61f0b3c78e3d1637d6e1337f"},"createdAt":{"$date":"2022-01-26T02:36:55.92Z"},"updatedAt":{"$date":"2022-01-26T02:36:55.92Z"},"name":"Take the wind out of someone's sails","user":null,"meaning":"To cause someone to lose confidence or energy","synonyms":["n/a"],"tags":["Meet You in the Middle"],"sentences":["The team's star player was injured and it really took the wind out of their sails.","I got into an accident 4 years ago and it took the wind out of my sails."],"types":["Expression"],"__v":null},
    {"_id":{"$oid":"61f0b29b8e3d1637d6e1337e"},"createdAt":{"$date":"2022-01-26T02:31:55.184Z"},"updatedAt":{"$date":"2022-01-26T02:31:55.184Z"},"name":"Rain on someone's parade","user":null,"meaning":"To spoil someone's pleasure","synonyms":["n/a"],"tags":["Hulu"],"sentences":["I don't mean to rain on your parade but I have some bad news."],"types":["Expression"],"__v":null}
]

enum WordType {
    Adverb,
    Adjective,
    Excerpt,
    Expression,
    Noun,
    Verb,
    Metaphor,
    PhrasalVerb
}

const morphedWords = []

for(const word of words) {
    const types = word.types
    const mappedTypes = types.map(type => {
        switch(type) {
            case 'Noun':
                return WordType.Noun
            case 'Adjective':
                return WordType.Adjective
            case 'Adverb':
                return WordType.Adverb
            case 'Excerpt':
                return WordType.Excerpt
            case 'Expression':
                return WordType.Expression
            case 'Verb':
                return WordType.Verb
            case 'Phrasal Verb':
                return WordType.PhrasalVerb
            case 'Metaphor':
                return WordType.Metaphor
            default:
                return -1
        }
    })
    const morphedWord = {
        ...word,
        types: mappedTypes
    }
    morphedWords.push(morphedWord)
}

let bigString = ''
for(const word of morphedWords) {
    bigString += JSON.stringify(word)
}
writeFile('./morphedWords.json', bigString, () => {

})




