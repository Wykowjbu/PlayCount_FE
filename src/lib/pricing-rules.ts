export interface PricingRuleWindow { days: string[]; startTime: string; endTime: string; }

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function hasPricingOverlap(existing: PricingRuleWindow[], candidate: PricingRuleWindow) {
  const candidateStart = toMinutes(candidate.startTime);
  const candidateEnd = toMinutes(candidate.endTime);
  return existing.some((rule) => rule.days.some((day) => candidate.days.includes(day))
    && candidateStart < toMinutes(rule.endTime)
    && candidateEnd > toMinutes(rule.startTime));
}
