https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/semantic-cache

Remove mentions about what model is best or whatever because that shit always changes. Same for the embedding models, the reasoning models, LMs, whatever it is.

On the context layer of the builder, we missed one part of the layers, which is any data that we would inject into the system in real time. 

On the interactive orchestration patterns, I noticed that when I click on the chat, sometimes a bunch of them get selected at once. Same happens for some examples when I press into some of the docs for the search map reduce thing. For the orchestrator worker, it seems to work perfectly. I don't see any problem with it.

On the constant time analysis parallel versus linear section, I have the percentages all as small and the numbers as big and I think it should be the other way around because like 0.00090 sounds kind of not a lot but the percentages do matter, right?

In the interactive schema builder, I feel like each of you put the name and the description for the field that you create.

I like the interactive tool, Limbocation Flow. I think it's good. I think that the play button needs to be a little faster. And when the LLM generates a response at the end, it should give you an example of the weather in San Francisco. It's 18 degrees Celsius and the condition is sunny or whatever, right?

In the tools and function calling section, the KeepTools focus advice is okay. Add the caveat that you want to do that if it's always going to be in that order. So you want a function that does like one tool call that does as much as it can if it's only going to be used that one way. But if you expect it to sometimes do search and sometimes do update and sometimes notify then you need to split it up.

I feel like on the agent we didn't go low level enough when talking about the agentic loop Because we should be saying that it will call dlm on a loop until the lm produces the structured output like I finished right I think that's how it works and then it produces like a response to the user So we need to go a little bit deeper again. I don't like stopping conditions.ts I think that it's a bad practice to have code there At least like that So yeah, I think we need to kind of you know make that a little bit better

I think that on the interactive demo for RAG as agent tool or RAG as context engineering, the default speed is a little bit too fast to follow.

I think we should only mention Hyde, so the hypothetical questions thing, documenting the meetings, when talking about the RAC for context engineering, because it's more relevant there.

I think when talking about vector databases, our recommendation and the one we should include in examples and stuff is "pg-vector" because you can make queries that are mixed SQL and embeddings and that's just so powerful.

When talking about model routing, we should be also talking about model aliases and having fullbacks and all that kind of stuff. So you could pass the reasoning model or whatever and it knows which one to route and have the fullbacks and all that kind of thing. So that's probably like a little section that goes right next to the model routing thing.

So for the router simulator example, couldn't we do like a tiny tiny model that runs on the browser to even try this or would that be way too much?


One section we need to add is about kind of evolving the context by having like episodic summarization or by having like retrospective on error rates and stuff and creating like a learnings thing that you can then use in similar situations be embeddings or similar, right? Or as a part of like the skill context to kind of go through an iterative process of improving the performance of your agent. We also probably need like a whole section and observability and stuff like using lamp fuse to label your data and stuff to see how it's failing so that you can modify the prompt or that you can add those learns in. But the automated process is really interesting I think and there is papers about it.


We for sure need an entire section at least on how to structure data so that it becomes actionable with AI. Kind of having the right objects to form an ontology and an action plane, having your API defined as a deterministic layer and then having your AI checked against that but have your skills be something that you can configure using your own surface so that they are cobbled but one is data driven instead. You're going to have agents and you have system that runs agents. How do I make agents happen as a data structure thing?

Also, we need to add a section about how to do streaming and how to do live calls and what's the flow for voice agents and that kind of thing. We need a section for that.

I was thinking maybe we can have like a as a part of this like an example project or something like that So that the code is actually, you know linked to an actual file that is part of something that is coherent that way like The implementation makes sense in terms of like what they see I instantly something simple, but I was thinking maybe like a Virtual tabletop RPG game assistant thing so something that you could put Your RPG manuals in and it parse it parse them, you know parse the PDFs And then I'll do to chat through with it and to put it on this card so that people can ask like rules questions and stuff And get answers on that. 