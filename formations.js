/* ========================================
   FORMATION DATA
   All positions, patterns, and commentary
   ======================================== */

const FORMATIONS = {
  "433": {
    name: "4-3-3",
    subtitle: "Wide Attacking Formation",
    style: "Attacking",
    overview: "The 4-3-3 is one of football's most attack-minded formations. Three forwards stretch the opposition's defence across the full width of the pitch, creating space in behind and between the lines. The midfield three provides balance, with one sitting deep and two driving forward to support attacks.",
    strengths: [
      "Width stretches the defence, creating gaps in central areas",
      "Wingers provide constant 1v1 threats on the flanks",
      "High press with three forwards makes it hard for opponents to build from the back",
      "Natural passing triangles make it easy to keep possession"
    ],
    weaknesses: [
      "Midfield can be overrun against formations with four or five midfielders",
      "Full-backs must cover the flanks alone when wingers push high",
      "If wingers don't track back, the team is vulnerable to counter-attacks on the wings",
      "Requires technically gifted players to maintain the structure"
    ],
    famousTeams: ["Barcelona (Pep era)", "Liverpool (Klopp)", "Ajax (Cruyff)", "2010 Spain"],
    stats: {
      attack: 90,
      midfield: 65,
      defence: 60,
      width: 95,
      pressing: 85
    },
    // Base positions: [x%, y%] on pitch (0,0 = top-left, 100,100 = bottom-right)
    // Pitch is oriented with attacking direction going UP (towards top)
    basePositions: [
      { id: "GK",  label: "GK",  x: 50, y: 92, role: "Goalkeeper" },
      { id: "LB",  label: "LB",  x: 15, y: 75, role: "Left Back" },
      { id: "LCB", label: "CB",  x: 37, y: 80, role: "Centre Back" },
      { id: "RCB", label: "CB",  x: 63, y: 80, role: "Centre Back" },
      { id: "RB",  label: "RB",  x: 85, y: 75, role: "Right Back" },
      { id: "DM",  label: "DM",  x: 50, y: 62, role: "Defensive Mid" },
      { id: "LCM", label: "CM",  x: 32, y: 52, role: "Left Centre Mid" },
      { id: "RCM", label: "CM",  x: 68, y: 52, role: "Right Centre Mid" },
      { id: "LW",  label: "LW",  x: 15, y: 30, role: "Left Winger" },
      { id: "ST",  label: "ST",  x: 50, y: 25, role: "Striker" },
      { id: "RW",  label: "RW",  x: 85, y: 30, role: "Right Winger" }
    ],
    attackPattern: {
      phases: [
        {
          name: "Build-Up",
          shortDesc: "Playing out from the back",
          description: "The centre-backs split wide and the defensive midfielder drops between them. The goalkeeper starts the play by passing to a centre-back, who looks to find the DM. Full-backs push up to provide width.",
          insight: "This is the foundation of the 4-3-3. By having the DM drop deep, the team creates a 3v2 advantage against formations with two forwards, making it very hard for the opposition to press effectively.",
          duration: 3000,
          ballPath: ["GK", "RCB", "DM", "LCB"],
          movements: {
            "LCB": { x: 28, y: 75 },
            "RCB": { x: 72, y: 75 },
            "DM":  { x: 50, y: 70 },
            "LB":  { x: 10, y: 60 },
            "RB":  { x: 90, y: 60 },
            "LCM": { x: 35, y: 48 },
            "RCM": { x: 65, y: 48 }
          }
        },
        {
          name: "Progression",
          shortDesc: "Moving the ball into midfield",
          description: "The left centre-back plays a crisp pass into the left centre midfielder who has dropped into a pocket of space. The CM turns and looks forward. The left winger stays high and wide, pinning the opposing full-back.",
          insight: "The key here is the CM's body position. By checking his shoulder before receiving, he knows exactly where the space is. The winger staying wide creates a 'horizontal stretch' that opens up the half-space.",
          duration: 3000,
          ballPath: ["LCB", "LCM"],
          movements: {
            "LCM": { x: 30, y: 42 },
            "LW":  { x: 10, y: 25 },
            "ST":  { x: 50, y: 22 },
            "RW":  { x: 80, y: 28 },
            "RCM": { x: 62, y: 42 },
            "DM":  { x: 50, y: 55 }
          }
        },
        {
          name: "Wide Overload",
          shortDesc: "Creating a 2v1 on the flank",
          description: "The CM slides the ball wide to the left winger. The left-back makes an overlapping run on the outside, creating a 2v1 against the opposing right-back. The striker begins to move towards the near post.",
          insight: "This overlap is the bread and butter of the 4-3-3. It forces the defender into an impossible decision: follow the full-back's overlap and leave the winger free to cut inside, or stay with the winger and leave the full-back free to deliver a cross.",
          duration: 3500,
          ballPath: ["LCM", "LW"],
          movements: {
            "LB":  { x: 5, y: 30 },
            "LW":  { x: 15, y: 22 },
            "ST":  { x: 42, y: 18 },
            "RW":  { x: 72, y: 22 },
            "RCM": { x: 55, y: 38 },
            "LCM": { x: 28, y: 35 },
            "DM":  { x: 45, y: 50 }
          }
        },
        {
          name: "Final Third",
          shortDesc: "Creating the scoring chance",
          description: "The winger dribbles at the defender, then lays it off to the overlapping full-back who delivers a low cross. The striker attacks the near post, the right winger makes a late run to the far post, and the right CM arrives at the edge of the box.",
          insight: "Three attackers in the box, each covering a different zone (near post, far post, edge of area), makes this incredibly hard to defend. The defence has to track three runners simultaneously, and one is almost always free.",
          duration: 4000,
          ballPath: ["LW", "LB", "ST"],
          movements: {
            "LB":  { x: 8, y: 15 },
            "LW":  { x: 22, y: 18 },
            "ST":  { x: 38, y: 10 },
            "RW":  { x: 62, y: 12 },
            "RCM": { x: 55, y: 22 },
            "LCM": { x: 32, y: 30 },
            "DM":  { x: 48, y: 42 }
          }
        }
      ]
    }
  },

  "442": {
    name: "4-4-2",
    subtitle: "Classic Partnership Formation",
    style: "Balanced",
    overview: "The 4-4-2 is football's most iconic formation. Its power lies in its simplicity: two banks of four create a compact defensive block, while the two strikers work as a partnership to stretch and unbalance defences. Wide midfielders provide service from the flanks.",
    strengths: [
      "Clear defensive structure with two compact lines of four",
      "Two strikers create a natural partnership and more goal threats",
      "Wide midfielders can quickly transition from defence to attack",
      "Easy to understand and implement at any level of football"
    ],
    weaknesses: [
      "Can be outnumbered in central midfield (only two CMs)",
      "Wide midfielders have huge ground to cover both ways",
      "Less effective at controlling possession against three-man midfields",
      "Strikers can become isolated if midfield can't progress the ball"
    ],
    famousTeams: ["Man United (Ferguson)", "AC Milan (Sacchi)", "Atletico Madrid", "2016 Leicester"],
    stats: {
      attack: 75,
      midfield: 70,
      defence: 80,
      width: 80,
      pressing: 75
    },
    basePositions: [
      { id: "GK",  label: "GK",  x: 50, y: 92, role: "Goalkeeper" },
      { id: "LB",  label: "LB",  x: 15, y: 75, role: "Left Back" },
      { id: "LCB", label: "CB",  x: 37, y: 80, role: "Centre Back" },
      { id: "RCB", label: "CB",  x: 63, y: 80, role: "Centre Back" },
      { id: "RB",  label: "RB",  x: 85, y: 75, role: "Right Back" },
      { id: "LM",  label: "LM",  x: 12, y: 50, role: "Left Mid" },
      { id: "LCM", label: "CM",  x: 38, y: 55, role: "Left Centre Mid" },
      { id: "RCM", label: "CM",  x: 62, y: 55, role: "Right Centre Mid" },
      { id: "RM",  label: "RM",  x: 88, y: 50, role: "Right Mid" },
      { id: "LS",  label: "ST",  x: 38, y: 25, role: "Left Striker" },
      { id: "RS",  label: "ST",  x: 62, y: 25, role: "Right Striker" }
    ],
    attackPattern: {
      phases: [
        {
          name: "Build-Up",
          shortDesc: "Secure possession from the back",
          description: "One centre-back carries the ball forward while the other covers behind. The two central midfielders stagger themselves: one drops deep to offer a safe passing option, the other pushes higher to connect with the strikers.",
          insight: "In a 4-4-2, the build-up phase relies on the centre-backs being comfortable on the ball. The staggered midfield gives two clear passing lanes: a safe short option and a more aggressive line-breaking pass.",
          duration: 3000,
          ballPath: ["GK", "RCB", "RCM"],
          movements: {
            "RCB": { x: 60, y: 72 },
            "LCB": { x: 40, y: 82 },
            "RCM": { x: 58, y: 50 },
            "LCM": { x: 42, y: 60 },
            "LB":  { x: 12, y: 65 },
            "RB":  { x: 88, y: 65 },
            "LM":  { x: 12, y: 45 },
            "RM":  { x: 85, y: 45 }
          }
        },
        {
          name: "Switch of Play",
          shortDesc: "Shifting to the opposite flank",
          description: "The right CM plays a diagonal ball across to the left midfielder. This 'switch of play' catches the opposition's defensive shape shifting and creates space on the left. The left-back begins an overlapping run.",
          insight: "The beauty of the 4-4-2 is how quickly it can switch the point of attack. By moving the ball from one flank to the other, the team exploits the time it takes for defenders to shift across. This is why teams that play a 4-4-2 well always look to go wide first.",
          duration: 3000,
          ballPath: ["RCM", "LCM", "LM"],
          movements: {
            "LM":  { x: 10, y: 35 },
            "LB":  { x: 8, y: 40 },
            "LCM": { x: 35, y: 45 },
            "RCM": { x: 55, y: 45 },
            "LS":  { x: 35, y: 22 },
            "RS":  { x: 58, y: 20 },
            "RM":  { x: 78, y: 38 }
          }
        },
        {
          name: "Striker Movement",
          shortDesc: "Creating space through partnership play",
          description: "One striker drops deep to receive a pass from the left midfielder. As he comes short, the other striker makes a run in behind the defence. This classic 'one drops, one runs' movement is the heart of a good strike partnership.",
          insight: "The strike partnership is what makes a 4-4-2 so dangerous. When one striker comes short, the centre-back has to decide: follow him and leave a gap in the defensive line, or hold position and give him time to turn. Either way, the attacking team wins.",
          duration: 3500,
          ballPath: ["LM", "LS"],
          movements: {
            "LS":  { x: 32, y: 30 },
            "RS":  { x: 55, y: 15 },
            "LM":  { x: 15, y: 28 },
            "LB":  { x: 10, y: 30 },
            "RCM": { x: 52, y: 35 },
            "LCM": { x: 38, y: 38 },
            "RM":  { x: 75, y: 30 }
          }
        },
        {
          name: "Final Third",
          shortDesc: "Delivering the killer ball",
          description: "The dropping striker lays it off to the onrushing left CM, who plays a through ball to the second striker running in behind. The right midfielder arrives at the far post, giving a second option. The wide players and CMs flood the box.",
          insight: "The 4-4-2 creates goal-scoring chances through direct combination play. Unlike the 4-3-3 which attacks through wide areas, the 4-4-2 often finishes moves centrally through the striker partnership and late-arriving midfielders.",
          duration: 4000,
          ballPath: ["LS", "LCM", "RS"],
          movements: {
            "RS":  { x: 50, y: 8 },
            "LS":  { x: 38, y: 22 },
            "LCM": { x: 40, y: 28 },
            "RCM": { x: 55, y: 25 },
            "LM":  { x: 20, y: 18 },
            "RM":  { x: 68, y: 15 },
            "LB":  { x: 15, y: 35 },
            "RB":  { x: 80, y: 45 }
          }
        }
      ]
    }
  },

  "4231": {
    name: "4-2-3-1",
    subtitle: "Modern Controlling Formation",
    style: "Possession",
    overview: "The 4-2-3-1 is the Swiss army knife of modern football. The double pivot (two defensive midfielders) provides a secure base, while three attacking midfielders link the play to a lone striker. It offers both defensive solidity and creative freedom, making it the most popular formation in professional football.",
    strengths: [
      "Double pivot provides excellent protection for the back four",
      "Number 10 can roam freely between the lines to create chances",
      "Smooth transition between attack and defence with compact shape",
      "Extremely flexible: can morph into different shapes in and out of possession"
    ],
    weaknesses: [
      "The lone striker can become isolated and must hold the ball up well",
      "If the number 10 doesn't contribute defensively, there's a gap between midfield and attack",
      "Requires a very specific profile for the lone striker: strong, technical, and intelligent",
      "Can become too cautious if both defensive midfielders stay deep"
    ],
    famousTeams: ["Real Madrid (Mourinho)", "Germany (2014 WC)", "Dortmund (Klopp)", "Chelsea (Ancelotti)"],
    stats: {
      attack: 75,
      midfield: 85,
      defence: 82,
      width: 75,
      pressing: 80
    },
    basePositions: [
      { id: "GK",  label: "GK",  x: 50, y: 92, role: "Goalkeeper" },
      { id: "LB",  label: "LB",  x: 15, y: 75, role: "Left Back" },
      { id: "LCB", label: "CB",  x: 37, y: 80, role: "Centre Back" },
      { id: "RCB", label: "CB",  x: 63, y: 80, role: "Centre Back" },
      { id: "RB",  label: "RB",  x: 85, y: 75, role: "Right Back" },
      { id: "LDM", label: "DM",  x: 38, y: 60, role: "Left Def. Mid" },
      { id: "RDM", label: "DM",  x: 62, y: 60, role: "Right Def. Mid" },
      { id: "LW",  label: "LW",  x: 15, y: 38, role: "Left Winger" },
      { id: "CAM", label: "10",  x: 50, y: 38, role: "Playmaker" },
      { id: "RW",  label: "RW",  x: 85, y: 38, role: "Right Winger" },
      { id: "ST",  label: "ST",  x: 50, y: 22, role: "Striker" }
    ],
    attackPattern: {
      phases: [
        {
          name: "Build-Up",
          shortDesc: "Controlling from the double pivot",
          description: "The two defensive midfielders position themselves either side of the centre circle. The centre-backs spread wide. This creates a diamond shape in the first phase that gives multiple short passing angles, making it almost impossible to press effectively.",
          insight: "The double pivot is the engine room. Having two holding midfielders means one can step forward to receive while the other covers. This gives the team a safety net that formations like the 4-3-3 don't have. It's why coaches love this system against strong pressing teams.",
          duration: 3000,
          ballPath: ["GK", "LCB", "LDM", "RDM"],
          movements: {
            "LCB": { x: 30, y: 74 },
            "RCB": { x: 70, y: 74 },
            "LDM": { x: 40, y: 58 },
            "RDM": { x: 60, y: 58 },
            "LB":  { x: 10, y: 60 },
            "RB":  { x: 90, y: 60 },
            "CAM": { x: 50, y: 42 }
          }
        },
        {
          name: "Finding the 10",
          shortDesc: "Threading the ball to the playmaker",
          description: "The right defensive midfielder spots the number 10 drifting into space between the opposition's midfield and defensive lines. He plays a precise pass into feet. The 10 receives on the half-turn, instantly opening up the final third.",
          insight: "This is the moment the 4-2-3-1 becomes lethal. The number 10 operating in 'the hole' between the lines is extremely difficult to pick up. If a midfielder tracks him, space opens in midfield. If a centre-back steps up, the striker has room to exploit.",
          duration: 3000,
          ballPath: ["RDM", "CAM"],
          movements: {
            "CAM": { x: 48, y: 35 },
            "LW":  { x: 12, y: 30 },
            "RW":  { x: 82, y: 30 },
            "ST":  { x: 50, y: 18 },
            "LDM": { x: 42, y: 52 },
            "RDM": { x: 58, y: 52 },
            "LB":  { x: 12, y: 48 },
            "RB":  { x: 88, y: 48 }
          }
        },
        {
          name: "Creative Combination",
          shortDesc: "Quick interplay to unlock the defence",
          description: "The number 10 plays a quick one-two with the striker. As the striker lays it off, the 10 bursts forward into the space the striker has vacated. The left winger comes narrow while the left-back overlaps, and the right winger stretches the play.",
          insight: "This one-two between the 10 and the striker is the signature move of the 4-2-3-1. It's a combination play that exploits the space between the opposition's midfield and defence. The winger's movement is crucial: coming narrow pulls the full-back inward, creating space for the overlapping full-back.",
          duration: 3500,
          ballPath: ["CAM", "ST", "CAM"],
          movements: {
            "CAM": { x: 45, y: 25 },
            "ST":  { x: 48, y: 22 },
            "LW":  { x: 25, y: 22 },
            "RW":  { x: 78, y: 25 },
            "LB":  { x: 10, y: 28 },
            "RDM": { x: 55, y: 42 },
            "LDM": { x: 40, y: 42 }
          }
        },
        {
          name: "Final Third",
          shortDesc: "Creating the goal-scoring opportunity",
          description: "The 10 drives forward and slides the ball wide to the overlapping left-back. The striker peels to the near post, the right winger arrives at the far post, and the 10 positions himself on the edge of the box for a potential cutback or rebound.",
          insight: "The 4-2-3-1 generates chances through patient build-up and then sudden acceleration. With both DMs sitting in front of the defence, the team has perfect balance: four players attack while six maintain defensive shape. This is why the 4-2-3-1 is the 'safe' choice for managers.",
          duration: 4000,
          ballPath: ["CAM", "LB", "ST"],
          movements: {
            "LB":  { x: 8, y: 15 },
            "ST":  { x: 40, y: 10 },
            "CAM": { x: 48, y: 20 },
            "LW":  { x: 28, y: 15 },
            "RW":  { x: 65, y: 12 },
            "LDM": { x: 38, y: 38 },
            "RDM": { x: 55, y: 38 }
          }
        }
      ]
    }
  }
};
