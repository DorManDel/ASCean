import { requireValue } from './world';
import type { Evidence } from './contracts';
export type ReviewedFinding={schema:1;id:string;kind:'finding'|'experiment-proposal';evidence:Evidence;review:{status:'approved';reviewer:string;date:string};claim:string;sourceUrl:string;doi:string|null;species:string;lifeStage:string;habitat:string;units:string;license:string;uncertainty:string;calibrationTest:string;implementationRef:string|null};
/** Read-only metadata boundary. Approval is an assertion, not authenticated scientific truth. */
export function readReviewedFinding(input:unknown):Readonly<ReviewedFinding>{
  const r=structuredClone(input) as ReviewedFinding;
  requireValue(r?.schema===1&&['finding','experiment-proposal'].includes(r.kind)&&r.review?.status==='approved','Only human-approved schema-1 findings/proposals');
  requireValue(['source_verified','calibrated','illustrative','proposed','unknown'].includes(r.evidence),'Missing evidence status');
  for(const value of [r.id,r.claim,r.sourceUrl,r.species,r.lifeStage,r.habitat,r.units,r.license,r.uncertainty,r.calibrationTest,r.review.reviewer,r.review.date])requireValue(typeof value==='string'&&value.length>0&&value.length<=10000,'Missing review provenance');
  requireValue(/^https:\/\//.test(r.sourceUrl)&&(r.doi===null||typeof r.doi==='string')&&(r.implementationRef===null||typeof r.implementationRef==='string'),'Invalid source metadata');
  requireValue(Object.keys(r).every(k=>['schema','id','kind','evidence','review','claim','sourceUrl','doi','species','lifeStage','habitat','units','license','uncertainty','calibrationTest','implementationRef'].includes(k)),'Executable coefficients/import extensions not permitted');
  Object.freeze(r.review);return Object.freeze(r);
}
