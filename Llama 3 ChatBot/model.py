from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import HuggingFaceEndpoint
from langchain.chains import RetrievalQA
import chainlit as cl
import os
import time
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

DB_FAISS_PATH = 'vectorstore/db_faiss'

custom_prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

@cl.on_chat_start
async def start():
    chain = qa_bot()  # Assuming qa_bot() sets up your chain
    msg = cl.Message(content="Chat session has started.")
    await msg.send()
    cl.user_session.set("chain", chain)

# Define the `on_message` callback
@cl.on_message
async def main(message: cl.Message):
    chain = cl.user_session.get("chain")
    if not chain:
        await cl.Message(content="No active chat session.").send()
        return

    start_time = time.time()
    # Process the incoming message and generate a response
    response = await chain.ainvoke(message.content)
    end_time = time.time()
    logging.info(f"Response time: {end_time - start_time} seconds")

    await cl.Message(content=response).send()

def set_custom_prompt():
    """
    Prompt template for QA retrieval for each vectorstore
    """
    prompt = PromptTemplate(template=custom_prompt_template,
                            input_variables=['context', 'question'])
    return prompt

# Retrieval QA Chain
def retrieval_qa_chain(llm, prompt, db):
    qa_chain = RetrievalQA.from_chain_type(llm=llm,
                                           chain_type='stuff',
                                           retriever=db.as_retriever(search_kwargs={'k': 2}),
                                           return_source_documents=True,
                                           chain_type_kwargs={'prompt': prompt}
                                           )
    return qa_chain

# Loading the model
def load_llm():
    api_token = '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'
    if not api_token:
        raise ValueError("Did not find huggingfacehub_api_token, please add an environment variable HUGGINGFACEHUB_API_TOKEN")

    # Updated model identifier
    repo_id = "meta-llama/Meta-Llama-3-8B-Instruct"  
    task = "text-generation"  

    # Create and time the model loading
    start_time = time.time()
    llm = HuggingFaceEndpoint(repo_id=repo_id, task=task, huggingfacehub_api_token=api_token)
    end_time = time.time()
    logging.info(f"Model loading time: {end_time - start_time} seconds")
    return llm

# QA Model Function
def qa_bot():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={'device': 'cpu'})
    db = FAISS.load_local(DB_FAISS_PATH, embeddings)
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)

    return qa

# Output function
def final_result(query):
    qa_result = qa_bot()
    response = qa_result({'query': query})
    return response

# Chainlit code
@cl.on_chat_start
async def start():
    chain = qa_bot()
    msg = cl.Message(content="The automaton doth ponder ")
    await msg.send()
    msg.content = "Hello how can i help you today ?"
    await msg.update()

    cl.user_session.set("chain", chain)

@cl.on_message
async def main(message: cl.Message):
    chain = cl.user_session.get("chain") 
    cb = cl.AsyncLangchainCallbackHandler(
        stream_final_answer=True, answer_prefix_tokens=["FINAL", "ANSWER"]
    )
    cb.answer_reached = True
    start_time = time.time()
    res = await chain.ainvoke(message.content, callbacks=[cb])
    end_time = time.time()
    logging.info(f"Response time with callback: {end_time - start_time} seconds")
    
    answer = res["result"]
    sources = res["source_documents"]

    if sources:
        answer += f"\n\n\nSources:" + str(sources)
    else:
        answer += "\nNo sources found"

    await cl.Message(content=answer).send()
