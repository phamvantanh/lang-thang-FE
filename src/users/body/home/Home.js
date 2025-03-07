import React, { useState, useEffect } from 'react'
import axios from 'axios';
import "./home.css"
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser'
import CurrentPost from './components/CurrentPost';
import CommentPost from './components/CommentPost'
import Loading from '../../utils/Loading/Loading';


function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Bai viet ở trên cùng
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [cmtPosts, setCmtPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loadingPage, setLoadingPage] = useState(false)
  const length = 5

  const [currentPage, setCurrentPage] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)



  //[] => chi 1 lan khi load trang
  // khong co [] load lien tuc
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('/post', {
        params: {
          prop: "bookmark",
          size: 10
        }
      })
      setFeaturedPosts(res.data)
      setLoadingPage(true)
    }
    getData()

  }, [])


  //GET COMMENTS POST
  useEffect(() => {
    const getCmtPosts = async () => {
      const res = await axios.get('/post', {
        params: {
          prop: "comment",
          size: 11
        }
      })
      if (res) {
        setCmtPosts(res.data)
      }
    }
    getCmtPosts()
  }, [])

  useEffect(() => {
    const getRecentPost = async () => {
      const res = await axios.get('/post', {
        params: {
          page: currentPage
        }
      })
      setRecentPosts([...recentPosts, ...res.data])
      if (res.data.length === 0 || res.data.length < 10) {
        setIsEmpty(true)
      }
    }
    getRecentPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])



  // Di chuyen slide
  const nextSlide = () => {
    setCurrentSlide(currentSlide === length - 1 ? 0 : currentSlide + 1)
  }

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? length - 1 : currentSlide - 1)
  }

  return (
    <>
      {loadingPage ?
        <main className="main__home">
          <div className="container">
            {/* FEATURED POST */}
            <div className="featured__post pt-15 font-small text-uppercase pb-15">
              <h5 style={{ fontSize: '14px' }}>Các bài đăng nổi bật</h5>
            </div>
            <div className="row-1">
              <div className="col-lg-8 mb-30">
                {/* TODO: NỔI BẬT POSTS */}
                {
                  featuredPosts.map((post, index) => {
                    if (index < 6) {
                      return (
                        <div key={post.postId}>
                          {index === currentSlide && (
                            <div className="slider thumb-overlay hieu-ung">
                              <div className="arrow-cover">
                                <i className="fal fa-long-arrow-left" onClick={prevSlide}></i>
                                <i className="fal fa-long-arrow-right" onClick={nextSlide}></i>
                              </div>

                              <img src={ReactHtmlParser(post.postThumbnail)} alt='travel image' className='image' />
                              <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                                <h3 className="post-title mb-20" style={{ fontSize: 20 }}>
                                  <Link to={{ pathname: `/posts/${post.slug}`, state: { id: post.postId } }}
                                    className="text-white">
                                    {ReactHtmlParser(post.title)}
                                  </Link>
                                </h3>
                                <div className="entry-meta meta-1 font-small text-white mt-10 " style={{ textAlign: 'left' }}>
                                  <span>{post.bookmarkedCount} lượt bookmark</span>
                                  <span className="has-dos">{post.commentCount} bình luận</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }
                  })
                }
              </div>

              {featuredPosts.map((post, index) => {
                if (index > 5) {
                  return (
                    <div className="col-lg-4 col-md-6 mb-30" key={post.postId}>
                      <div className="post-card-1 border-radius-10 hieu-ung">
                        <div className="thumb-overlay img-hover-slide position-relative" style={{ background: `url(${ReactHtmlParser(post.postThumbnail)})` }}>
                        </div>
                        <div className="post-content p-30">
                          <div className="d-flex post-card-content">
                            <div className="currentPost__cataArea mb-10">
                              {post.categories.map((item) => {

                                return (
                                  <Link to={{ pathname: `/category/${item.categoryId}` }} key={item.categoryId}>
                                    <div className="currentPost__cata" key={item.categoryId}>{item.categoryName}</div>
                                  </Link>
                                )
                              })}
                            </div>
                            <h5 className="post-title">
                              <Link to={{ pathname: `/posts/${post.slug}`, state: { id: post.postId } }}>
                                {ReactHtmlParser(post.title)}
                              </Link>
                            </h5>

                            <div className="entry-meta meta-1 float-left font-x-small text-uppercase">
                              <span>{post.bookmarkedCount} lượt bookmark</span>
                              <span className="time-reading has-dos">{post.commentCount} bình luận</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

              })
              }
            </div>

          </div>

          {/* TODO: MỚI POSTS */}
          <div className="pt-15 pb-50" >
            <div className="container">
              <div className="row-1">
                <div className="col-lg-8">
                  <div className="post-module-2">
                    <div className="mb-30 position-relative">
                      <h5 className="mb-30 text-uppercase" style={{ fontSize: '14px' }}>Bài đăng mới</h5>
                    </div>
                    {/* ==== LOOP LIST ===== */}
                    <div className="loop-list">
                      {recentPosts.map((post) => {
                        return (
                          <CurrentPost post={post} key={post.postId} />
                        )
                      })}
                    </div>

                    {/* ======END LOOP LIST==== */}

                    {/*TODO: PAGINATION*/}

                    <div className="pagination-area mb-30">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-start">
                          <li className={`page-item" ${isEmpty ? 'disabled' : null}`}
                            onClick={() => setCurrentPage(currentPage + 1)}>
                            <a className="page-link">
                              <i className="fal fa-long-arrow-right"></i>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>

                    {/* ======END PAGINATION==== */}


                  </div>
                </div>
                <div className="col-lg-4">
                  {/* TODO: NHIỀU COMMENT */}
                  <div className="mb-15">
                    <h5 className="text-uppercase" style={{ fontSize: '14px' }}>Nhiều bình luận nhất</h5>
                  </div>
                  {/* <hr className="most-popular-hr" /> */}

                  {cmtPosts.map((item) => {
                    return (
                      <CommentPost item={item} key={item.postId} />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
        :
        <Loading />
      }
    </>
  )
}

export default Home
