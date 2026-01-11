"use client";

import { useState, useMemo } from "react";
import { SectionHeading, Card, CardContent, Callout } from "@/app/components/ui";
import {
  DollarSign,
  Zap,
  TrendingDown,
  Calculator,
} from "lucide-react";

// Interactive Budget Calculator
function BudgetCalculator() {
  const [requestsPerDay, setRequestsPerDay] = useState(1000);
  const [avgInputTokens, setAvgInputTokens] = useState(500);
  const [avgOutputTokens, setAvgOutputTokens] = useState(200);
  const [selectedModel, setSelectedModel] = useState("standard-capable");
  const [cacheHitRate, setCacheHitRate] = useState(30);

  // Note: These are example model tiers with representative pricing.
  // Actual prices change frequently - always check provider documentation.
  const models = useMemo(() => [
    { id: "premium-reasoning", name: "Premium Reasoning Tier", inputCost: 3, outputCost: 15, cacheCost: 0.3 },
    { id: "standard-capable", name: "Standard Capable Tier", inputCost: 1, outputCost: 5, cacheCost: 0.1 },
    { id: "fast-efficient", name: "Fast & Efficient Tier", inputCost: 0.25, outputCost: 1.25, cacheCost: 0.03 },
    { id: "economy", name: "Economy Tier", inputCost: 0.1, outputCost: 0.4, cacheCost: 0.01 },
  ], []);

  const calculations = useMemo(() => {
    const model = models.find(m => m.id === selectedModel)!;
    const requestsPerMonth = requestsPerDay * 30;
    
    // Calculate tokens
    const totalInputTokensPerDay = requestsPerDay * avgInputTokens;
    const totalOutputTokensPerDay = requestsPerDay * avgOutputTokens;
    
    // Without caching
    const dailyCostNoCaching = (
      (totalInputTokensPerDay / 1_000_000) * model.inputCost +
      (totalOutputTokensPerDay / 1_000_000) * model.outputCost
    );
    const monthlyCostNoCaching = dailyCostNoCaching * 30;

    // With caching
    const cachedInputTokens = totalInputTokensPerDay * (cacheHitRate / 100);
    const uncachedInputTokens = totalInputTokensPerDay - cachedInputTokens;
    
    const dailyCostWithCaching = (
      (uncachedInputTokens / 1_000_000) * model.inputCost +
      (cachedInputTokens / 1_000_000) * model.cacheCost +
      (totalOutputTokensPerDay / 1_000_000) * model.outputCost
    );
    const monthlyCostWithCaching = dailyCostWithCaching * 30;

    const savings = monthlyCostNoCaching - monthlyCostWithCaching;
    const savingsPercent = (savings / monthlyCostNoCaching) * 100;

    return {
      requestsPerMonth,
      totalInputTokensPerDay,
      totalOutputTokensPerDay,
      dailyCostNoCaching,
      monthlyCostNoCaching,
      dailyCostWithCaching,
      monthlyCostWithCaching,
      savings,
      savingsPercent,
      model,
    };
  }, [requestsPerDay, avgInputTokens, avgOutputTokens, selectedModel, cacheHitRate, models]);

  return (
    <div className="my-6 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Budget Calculator
        </h4>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 rounded-lg bg-muted border border-border text-foreground text-sm"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Requests per Day: <span className="text-foreground font-medium">{requestsPerDay.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(Number(e.target.value))}
              className="w-full accent-[var(--highlight)]"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Avg Input Tokens: <span className="text-foreground font-medium">{avgInputTokens.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={avgInputTokens}
              onChange={(e) => setAvgInputTokens(Number(e.target.value))}
              className="w-full accent-[var(--highlight)]"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Avg Output Tokens: <span className="text-foreground font-medium">{avgOutputTokens.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="50"
              max="4000"
              step="50"
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
              className="w-full accent-[var(--highlight)]"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Cache Hit Rate: <span className="text-foreground font-medium">{cacheHitRate}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Monthly Usage</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">{(calculations.requestsPerMonth / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {((calculations.totalInputTokensPerDay * 30) / 1_000_000).toFixed(1)}M
                </div>
                <div className="text-xs text-muted-foreground">input tokens</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <div className="text-xs text-rose-400 uppercase tracking-wide mb-1">Without Caching</div>
              <div className="text-xl font-bold text-rose-400">
                ${calculations.monthlyCostNoCaching.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">/month</div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-xs text-emerald-400 uppercase tracking-wide mb-1">With {cacheHitRate}% Cache</div>
              <div className="text-xl font-bold text-emerald-400">
                ${calculations.monthlyCostWithCaching.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">/month</div>
            </div>
          </div>

          {calculations.savings > 0 && (
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-400">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Save ${calculations.savings.toFixed(2)}/month ({calculations.savingsPercent.toFixed(0)}%)
                </span>
              </div>
            </div>
          )}

                  <div className="text-xs text-muted-foreground">
                    Example pricing: ${calculations.model.inputCost}/M input, ${calculations.model.outputCost}/M output, 
                    ${calculations.model.cacheCost}/M cached. <span className="text-amber-400">Prices vary by provider - check current rates.</span>
                  </div>
        </div>
      </div>
    </div>
  );
}

export function CostOptimizationSection() {
  return (
    <section id="cost-optimization" className="scroll-mt-20">
      <SectionHeading
        id="cost-optimization-heading"
        title="Cost Optimization"
        subtitle="Token budgeting, model selection, and cost control"
      />
      
      <div className="prose space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          LLM costs can scale quickly. Understanding <strong className="text-foreground">where 
          your tokens go</strong> and how to optimize spending is essential for production systems 
          that need to remain economically viable.
        </p>

        <Callout variant="info" title="Cost Awareness">
          <p className="m-0">
            Production AI systems require cost monitoring from day one. A bug that causes 
            infinite loops or unnecessarily large contexts can burn through budgets in hours.
          </p>
        </Callout>

        {/* Understanding Costs */}
        <h3 id="cost-overview" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Understanding Costs
        </h3>

        <p className="text-muted-foreground">
          LLM pricing is based on <strong className="text-foreground">tokens</strong>—roughly 
          4 characters or 0.75 words per token. You pay separately for input (what you send) 
          and output (what you receive).
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                <h4 className="font-medium text-foreground m-0">Input Tokens</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                System prompt + user message + context. Often the largest portion of cost.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <h4 className="font-medium text-foreground m-0">Output Tokens</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Model response. Usually 3-5x more expensive per token than input.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="default">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h4 className="font-medium text-foreground m-0">Cached Tokens</h4>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Reused prefixes. 75-90% cheaper than fresh input tokens.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Token Budgeting */}
        <h3 id="token-budgeting" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Token Budgeting
        </h3>

        <p className="text-muted-foreground">
          Effective cost control requires <strong className="text-foreground">budgeting tokens</strong> 
          across your system. Set limits per request, per user, and per time period.
        </p>

        <Card variant="highlight" className="mt-6">
          <CardContent>
            <h4 className="font-medium text-foreground mb-2">Budget Strategies</h4>
            <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
              <li><strong className="text-foreground">Per-request limits:</strong> Cap context size, truncate long conversations</li>
              <li><strong className="text-foreground">Per-user quotas:</strong> Fair usage limits, tiered by plan</li>
              <li><strong className="text-foreground">Daily/monthly caps:</strong> Hard limits to prevent runaway costs</li>
              <li><strong className="text-foreground">Alerts:</strong> Notify when spend exceeds thresholds</li>
            </ul>
          </CardContent>
        </Card>

        {/* Model Selection */}
        <h3 id="model-selection" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Model Selection
        </h3>

        <p className="text-muted-foreground">
          Not every task needs the most powerful model. <strong className="text-foreground">Route 
          requests to appropriate models</strong> based on complexity—simple tasks go to cheaper 
          models, complex tasks to more capable ones.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-amber-400 mb-2">Premium Models</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Complex reasoning tasks</li>
                <li>Code generation and review</li>
                <li>Multi-step planning</li>
                <li>Nuanced content creation</li>
              </ul>
            </CardContent>
          </Card>
          <Card variant="default">
            <CardContent>
              <h4 className="font-medium text-emerald-400 mb-2">Economy Models</h4>
              <ul className="text-sm text-muted-foreground m-0 pl-4 list-disc space-y-1">
                <li>Simple classification</li>
                <li>Summarization</li>
                <li>Routine Q&A</li>
                <li>Data extraction</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Budget Calculator */}
        <h3 id="budget-calculator" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Budget Calculator
        </h3>

        <p className="text-muted-foreground">
          Estimate your monthly LLM costs and see how caching affects spending:
        </p>

        <BudgetCalculator />

        {/* Cost Optimization Tips */}
        <h3 id="optimization-tips" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">
          Cost Optimization Tips
        </h3>

        <div className="grid gap-4">
          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Enable Prompt Caching</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Structure prompts with static prefixes. System prompts and rules should 
                    come first so they can be cached across requests.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Trim Context Aggressively</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Only include what&apos;s relevant. Summarize old conversation history. 
                    Use RAG to fetch context on-demand rather than including everything.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Use Model Routing</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Classify requests and route simple ones to cheaper models. A small 
                    model can often handle 80% of requests at 10% of the cost.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Set Hard Limits</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Implement circuit breakers that stop processing if costs exceed 
                    thresholds. Better to fail fast than burn budget.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Callout variant="tip" title="Monitor Everything">
          <p className="m-0">
            Track tokens per request, per endpoint, per user. Set up dashboards showing 
            daily spend trends. Cost surprises come from blind spots—if you&apos;re not 
            measuring it, you can&apos;t optimize it.
          </p>
        </Callout>
      </div>
    </section>
  );
}
