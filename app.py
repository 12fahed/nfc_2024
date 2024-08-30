import streamlit as st
import streamlit.components.v1 as stc
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load Dataset
def load_data(data):
    df = pd.read_csv(data)
    return df

# Vectorize Text + Cosine Similarity Matrix
def vectorize_text_to_cosine_mat(data):
    count_vect = CountVectorizer()
    cv_mat = count_vect.fit_transform(data)
    # Get the cosine similarity matrix
    cosine_sim_mat = cosine_similarity(cv_mat)
    return cosine_sim_mat

# Recommendation System
@st.cache_data
def get_recommendation(title, cosine_sim_mat, df, num_of_rec=10):
    # indices of the course
    course_indices = pd.Series(df.index, index=df['course_title']).drop_duplicates()
    # Index of the course
    idx = course_indices.get(title, None)
    if idx is None:
        return pd.DataFrame(columns=['course_title', 'similarity_score', 'url', 'price', 'num_subscribers'])
    # Look into the cosine matrix for that index
    sim_scores = list(enumerate(cosine_sim_mat[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    selected_course_indices = [i[0] for i in sim_scores[1:]]
    selected_course_scores = [i[1] for i in sim_scores[1:]]

    # Get the dataframe & title
    result_df = df.iloc[selected_course_indices]
    result_df['similarity_score'] = selected_course_scores
    final_recommended_courses = result_df[['course_title', 'similarity_score', 'url', 'price', 'num_subscribers']]
    return final_recommended_courses.head(num_of_rec)

RESULT_TEMP = """
<div style="width:100%;height:100%;margin:1px;padding:5px;position:relative;border-radius:5px;border-bottom-right-radius: 60px;
box-shadow:0 0 15px 5px #ccc; background-color: #a8f0c6;
  border-left: 5px solid #6c6c6c;">
<h4>{}</h4>
<p style="color:blue;"><span style="color:black;">📈Score::</span>{}</p>
<p style="color:blue;"><span style="color:black;">🔗</span><a href="{}",target="_blank">Link</a></p>
<p style="color:blue;"><span style="color:black;">💲Price:</span>{}</p>
<p style="color:blue;"><span style="color:black;">🧑‍🎓👨🏽‍🎓 Students:</span>{}</p>
</div>
"""

# Search For Course
@st.cache_data
def search_term_if_not_found(term, df):
    result_df = df[df['course_title'].str.contains(term, case=False, na=False)]
    return result_df

def main():
    st.title("Course Recommendation")

    # Load dataset
    df = load_data("udemy_course_data.csv")

    # Recommendation Page
    st.subheader("Recommend Courses")
    cosine_sim_mat = vectorize_text_to_cosine_mat(df['course_title'])
    search_term = st.text_input("Search")

    if st.button("Recommend"):
        if search_term:
            # try:
            #     num_of_rec = 10  # Fixed number of recommendations
            #     results = get_recommendation(search_term, cosine_sim_mat, df, num_of_rec)
            #     if not results.empty:
            #         with st.expander("Results as JSON"):
            #             results_json = results.to_dict('index')
            #             st.write(results_json)

            #         for index, row in results.iterrows():
            #             rec_title = row['course_title']
            #             rec_score = row['similarity_score']
            #             rec_url = row['url']
            #             rec_price = row['price']
            #             rec_num_sub = row['num_subscribers']

            #             stc.html(RESULT_TEMP.format(rec_title, rec_score, rec_url, rec_price, rec_num_sub), height=700)  # Increased height
            #     else:
            #         st.warning("No recommendations available.")
            # except Exception as e:
                # st.error(f"An error occurred: {e}")
                st.info("Suggested Options include")
                result_df = search_term_if_not_found(search_term, df)
                st.dataframe(result_df)

if __name__ == '__main__':
    main()
