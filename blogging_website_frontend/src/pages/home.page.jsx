import AnimationWrapper from "../common/page-animation";


const HomePage = () => {
    return (
        <AnimationWrapper>

            <section className="h-cover flex justify-center gap-10" >

                {/* Latest Blogs */}

                <div className="w-full">

                    <InPageNavigation>
                        
                    </InPageNavigation>


                </div>

                {/* filters and trending blogs */}

                <div>



                </div>

            </section>

        </AnimationWrapper>
    )
}

export default HomePage;