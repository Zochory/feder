import { drawLines, getInprocessPos, shortenLine } from "FederView/renderUtils2D";
import { EHnswLinkType } from "Types";
import { TVisDataHnswLink } from "Types/visData";
import HnswSearchView from ".";


export default function renderInProcessLinks (this: HnswSearchView,
  inProcessLinks: TVisDataHnswLink[],
  level: number
) {
  const id2node = this.id2node;
  const {
    canvasScale,
    linkShortenLineD,
    normalLinkWidth,
    normalGradientStopColors,
    importantLinkWidth,
    importantGradientStopColors,
  } = this.viewParams;

  // normal links
  const normalLinksPointsList = inProcessLinks
    .filter((link) => link.type <= EHnswLinkType.Extended)
    .map((link) => {
      const startPos = id2node[link.source].searchViewPosLevels[level];
      const endPos = id2node[link.target].searchViewPosLevels[level];
      return shortenLine(startPos, getInprocessPos(startPos, endPos, link.inprocessP) , linkShortenLineD * canvasScale);
    });

  drawLines({
    ctx: this.ctx,
    pointsList: normalLinksPointsList,
    hasStroke: true,
    isStrokeLinearGradient: true,
    gradientStopColors: normalGradientStopColors,
    lineWidth: normalLinkWidth * canvasScale,
    lineCap: 'round',
  });

  // importannt links
  const importantLinksPointsList = inProcessLinks
    .filter((link) => link.type >= EHnswLinkType.Searched)
    .map((link) => {
      const startPos = id2node[link.source].searchViewPosLevels[level];
      const endPos = id2node[link.target].searchViewPosLevels[level];
      return shortenLine(startPos, getInprocessPos(startPos, endPos, link.inprocessP), linkShortenLineD * canvasScale);
    });

  drawLines({
    ctx: this.ctx,
    pointsList: importantLinksPointsList,
    hasStroke: true,
    isStrokeLinearGradient: true,
    gradientStopColors: importantGradientStopColors,
    lineWidth: importantLinkWidth * canvasScale,
    lineCap: 'round',
  });
}