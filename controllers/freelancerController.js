const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  Auth
} = require("../models/authsModel");
const {
    FreelancerSubCategory,
    Terms,
    Privacy,
    FAQ,
    freelancerbanner,
    Cate_job,
    Power_Cat,
    Power_Cat_Sub,
    FreelancerHeadline,
    FreelancerBenefit,
    FreelancerWork
} = require("../models/adminModel");
const {
    freeFourtFolio,
    Bid,
    Apply,
    Apply_Project,
    Job_Favorite,
    Project_Favorite,
    Transaction_Report
} = require("../models/freelancerModel");
const {
Project,
Job
} = require("../models/companyModel");

require("dotenv").config();


const freelancergetProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const company = await Auth.findById(userId).select(
      "first_name last_name email mobile profile_image username total_project_comppleted rating experience resume_file skills education language emplement_history description verify_profile address latitude longitude links erning total_application block_status wallet_ammount"
    );

    if (!company) {
      return res.status(404).json({
        result: false,
        msg: "Freelancer Detail not found",
      });
    }

    const portfolio = await freeFourtFolio.find({ userId: userId }).select("name image userId about_project");

    const updatedPortfolio = portfolio.map((item) => {
      let imageArray = [];

      if (item.image && typeof item.image === "string") {
        imageArray = item.image.split(",").map((img) => img.trim()).filter(Boolean);
      }

      return {
        ...item._doc,
        image: imageArray,
      };
    });

    const profileFields = {
      first_name: company.first_name,
      last_name: company.last_name,
      email: company.email,
      mobile: company.mobile,
      profile_image: company.profile_image,
      resume_file: company.resume_file,
      username: company.username,
      rating: company.rating,
      total_application: company.total_application,
      erning: company.erning,
      address: company.address,
      latitude: company.latitude,
      longitude: company.longitude,
      description: company.description,
      verify_profile: company.verify_profile,
      experience: company.experience,
      total_project_comppleted: company.total_project_comppleted,
      block_status: company.block_status,
      links: company.links?.length > 0 ? company.links : null,
      skills: company.skills?.length > 0 ? company.skills : null,
      education: company.education?.length > 0 ? company.education : null,
      language: company.language?.length > 0 ? company.language : null,
      emplement_history: company.emplement_history?.length > 0 ? company.emplement_history : null,
      wallet_ammount:company.wallet_ammount || 0,
    };

   const totalFields = Object.keys(profileFields).length;

   const filledFields = Object.values(profileFields).filter(
   (value) => value !== undefined && value !== null && value !== "").length;

   const profilePercentage = Math.round((filledFields / totalFields) * 100);
    
    return res.status(200).json({
      result: true,
      msg: "Freelancer Details fetched successfully",
      data: {
        profile_percentage: profilePercentage + "%",
        userId: company._id || "",
        first_name: company.first_name || "",
        last_name: company.last_name || "",
        email: company.email || "",
        mobile: company.mobile || "",
        profile_image: company.profile_image || "",
        resume_file: company.resume_file || "",
        username: company.username || "",
        rating: company.rating || "0",
        address: company.address || "",
        erning: company.erning || "0",
        total_application: company.total_application || "0",
        lat: company.latitude || "",
        long: company.longitude || "",
        description: company.description || "",
        verify_profile: company.verify_profile || false,
        experience: company.experience || "",
        total_project_comppleted: company.total_project_comppleted || 0,
        block_status: company.block_status || "0",
        freelancer_links: company.links || [],
        skills: company.skills || [],
        education: company.education || [],
        language: company.language || [],
        emplement_history: company.emplement_history || [],
        portfolio: updatedPortfolio,
        wallet_ammount:company.wallet_ammount || 0,
      },
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};


const addPortfoliofreelancer = async (req, res) => {
    try {
      const { userId, name, about_project, skills } = req.body;
      const image = req.files ? req.files.map(file => file.filename).join(",") : null;
      if (!userId || !name  || !about_project || !skills || !image) {
        return res.status(400).json({ result: false, msg: "userId, name and image, about_project, skills are required" });
      }
  
      const newData = new freeFourtFolio({
        userId,
        name,
        about_project,
								skills: skills
							.split(",")
							.map(s => s.trim())
							.filter(s => s)
							.filter((v, i, a) => a.indexOf(v) === i),
        image
      });
  
      await newData.save();
  
      return res.status(200).json({
        result: true,
        msg: "Portfolio added successfully",
        data: newData
      });
  
    } catch (error) {
      return res.status(500).json({
        result: false,
        msg: "Something went wrong",
        error: error.message
      });
    }
  };
 const freelancerHeaderUpdate = async (req, res) => {
   try {
     const { userID, first_name, last_name, links, address, latitude, longitude } = req.body;
     const profile_image = req.files?.profile_image ? req.files.profile_image[0].filename : null;
 
     if (!userID) {
       return res.status(400).json({
         result: false,
         msg: "Parameter required: userID (optional: first_name, last_name, links, profile_image, address, latitude, longitude)",
       });
     }
 
     if (!mongoose.isValidObjectId(userID)) {
       return res.status(400).json({
         result: false,
         msg: "Invalid userID format",
       });
     }
 
     const user = await Auth.findById(userID);
     if (!user) {
       return res.status(404).json({
         result: false,
         msg: "User not found",
       });
     }

     if (user.account_type !== 'Freelancer') {
      return res.status(403).json({
        result: false,
        msg: "Only users with 'Freelancer' account_type can update company header",
      });
    }
 
     if (first_name) user.first_name = first_name;
     if (last_name) user.last_name = last_name;
     if (address) user.address = address;
     if (latitude) user.latitude = latitude;
     if (longitude) user.longitude = longitude;
     if (profile_image) user.profile_image = profile_image;
 
     if (links) {
       try {
         let parsedLinks = JSON.parse(links);
         if (Array.isArray(parsedLinks)) {
           user.links = parsedLinks.map(link => ({
             type: link.type.trim(),
             url: link.url.trim(),
           }));
         } else {
           return res.status(400).json({
             result: false,
             msg: "Links should be an array of objects [{type, url}]",
           });
         }
       } catch (error) {
         return res.status(400).json({
           result: false,
           msg: "Invalid links format, must be a valid JSON array",
         });
       }
     }
 
     await user.save();
 
 
     const responseUser = user.toObject();
     responseUser.links = responseUser.links.map(({ type, url }) => ({ type, url }));
 
     res.status(200).json({
       result: true,
       msg: "Freelancer Header Updated Successfully",
       data: responseUser,
     });
 
   } catch (error) {
     res.status(500).json({
       result: false,
       msg: "Error updating freelancer header",
       error: error.message,
     });
   }
 }; 

 const freelancerDescriptionUpdate = async (req, res) => {
   try {
     const { userID, description } = req.body;
 
     if (!userID) {
       return res.status(400).json({
         result: false,
         msg: "Parameter required: userID (optional: description )",
       });
     }
 
     if (!mongoose.isValidObjectId(userID)) {
       return res.status(400).json({
         result: false,
         msg: "Invalid userID format",
       });
     }
 
     const user = await Auth.findById(userID);
     if (!user) {
       return res.status(404).json({
         result: false,
         msg: "User not found",
       });
     }

     if (user.account_type !== 'Freelancer') {
      return res.status(403).json({
        result: false,
        msg: "Only users with 'Freelancer' account_type can update company header",
      });
    }
 
     if (description) user.description = description;
     await user.save();
 
     res.status(200).json({
       result: true,
       msg: "Freelancer Description Updated Successfully",
       data: user,
     });
 
   } catch (error) {
     res.status(500).json({
       result: false,
       msg: "Error updating freelancer description",
       error: error.message,
     });
   }
 };

 const freelancerresumeUpdate = async (req, res) => {
  try {
    const { userID } = req.body;
    const resume_file = req.files ? req.files.map(file => file.filename).join(",") : null;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: resume_file )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (user.account_type !== 'Freelancer') {
     return res.status(403).json({
       result: false,
       msg: "Only users with 'Freelancer' account_type can update company header",
     });
   }

    if (resume_file) user.resume_file = resume_file;

    await user.save();
    const responseUser = user.toObject();
    res.status(200).json({
      result: true,
      msg: "Freelancer Resume Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating freelancer resume",
      error: error.message,
    });
  }
}; 

const freelancerskillsUpdate = async (req, res) => {
  try {
    const { userID, skills } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: skills )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (user.account_type !== 'Freelancer') {
     return res.status(403).json({
       result: false,
       msg: "Only users with 'Freelancer' account_type can update freelancer skills",
     });
   }

   if (skills) {
    user.skills = skills
      .split(",")
      .map(s => s.trim())
      .filter(s => s)
      .filter((v, i, a) => a.indexOf(v) === i);
  }

    await user.save();

    res.status(200).json({
      result: true,
      msg: "Freelancer Skills Updated Successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating freelancer skills",
      error: error.message,
    });
  }
};

const freelancerupdateEducation = async (req, res) => {
  try {
    const { userID, education } = req.body;

    if (!userID || !education) {
      return res.status(400).json({
        result: false,
        msg: "Required parameters: userID and education array",
      });
    }

    if (!Array.isArray(education)) {
      return res.status(400).json({
        result: false,
        msg: "Education must be an array of objects",
      });
    }
    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (user.account_type !== 'Freelancer') {
      return res.status(403).json({
        result: false,
        msg: "Only users with 'Freelancer' account_type can update freelancer skills",
      });
    }

    for (let edu of education) {
      if (!edu.degree || !edu.institute || !edu.year) {
        return res.status(400).json({
          result: false,
          msg: "Each education object must have degree, institute, and year",
        });
      }
    }

    user.education = education;
    await user.save();

    res.status(200).json({
      result: true,
      msg: "Education updated successfully",
      data: user.education,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message,
    });
  }
};


const freelancerslanguageUpdate = async (req, res) => {
  try {
    const { userID, language } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: language )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (user.account_type !== 'Freelancer') {
     return res.status(403).json({
       result: false,
       msg: "Only users with 'Freelancer' account_type can update freelancer language",
     });
   }

    if (language) {
      user.language = language
        .split(",")
        .map(s => s.trim())
        .filter(s => s)
        .filter((v, i, a) => a.indexOf(v) === i);
    }
    await user.save();

    res.status(200).json({
      result: true,
      msg: "Freelancer Language Updated Successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating freelancer language",
      error: error.message,
    });
  }
};


const freelancerupdateEmploymentHistory = async (req, res) => {
  try {
    const { userID, emplement_history } = req.body;

    if (!userID || !emplement_history) {
      return res.status(400).json({
        result: false,
        msg: "Required parameters: userID and emplement_history array",
      });
    }

    if (!Array.isArray(emplement_history)) {
      return res.status(400).json({
        result: false,
        msg: "emplement_history must be an array of objects",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    for (let item of emplement_history) {
      if (!item.company_name || !item.role || !item.start_date || !item.end_date) {
        return res.status(400).json({
          result: false,
          msg: "Each emplement_history object must include company_name, role, start_date, and end_date",
        });
      }
    }

    user.emplement_history = emplement_history;
    await user.save();

    res.status(200).json({
      result: true,
      msg: "Employment history updated successfully",
      data: user.emplement_history,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

const getTermsconditionFreelancer = async (req, res) => {
  try {
    const fetchTerms = await Terms.find({ type: "Freelancer" });

    if (!fetchTerms || fetchTerms.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Freelancer!"
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Terms and Conditions list for type Freelancer",
      data: fetchTerms
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};


const getprivacyFreelancer = async (req, res) => {
  try {
    const fetchprivacy = await Privacy.find({ type: "Freelancer" });

    if (!fetchprivacy || fetchprivacy.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Freelancer!"
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Privacy Policy list for type Freelancer",
      data: fetchprivacy
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const getfaqFreelancer = async (req, res) => {
  try {
    const fetchfaq = await FAQ.find({ type: "Freelancer" });

    if (!fetchfaq || fetchfaq.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Freelancer!"
      });
    }

    res.status(200).json({
      result: "true",
      msg: "FAQ list for type Freelancer",
      data: fetchfaq
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const freelancergetprojectList = async (req, res) => {
	try {
	     const { userId } = req.body;
	     if (!userId) {
		 return res.status(400).json({
		      result: false,
		      msg: "Parameter required: userId",
		 });
	    }
	    const projects = await Project.find()
	               .sort({ createdAt: -1 })
			.select(
			   "userID catID project_name project_description budget_type experience min_budget mxn_budget skills fileattach total_proposal createdAt"
			).populate({
				path: "userID",
				select: "first_name last_name"  // Sirf ye do fields chahiye
			});
			const populatedJobs = await Promise.all(
			      projects.map(async (proj) => {
			      const category = await Cate_job.findById(proj.catID).select("name image");
			      const totalBids = await Bid.countDocuments({ projectID: proj._id });
			      const latestBid = await Bid.findOne({ projectID: proj._id }).sort({ _id: -1 });
                              const latestApplicationStatus = await Apply_Project.findOne({ projectID: proj._id }).sort({ _id: -1 });
                              const latestFavoriteStatus = await Project_Favorite.findOne({ projectID: proj._id }).sort({ _id: -1 });
                              return {
                                    _id: proj._id,
                                    userID: proj.userID?._id || '',
                                    first_name: proj.userID?.first_name || '',
                                    last_name: proj.userID?.last_name || '',
                                    catID: proj.catID || '',
                                    project_name: proj.project_name || '',
                                    project_description: proj.project_description || '',
                                    experience: proj.experience || '',
                                    budget_type: proj.budget_type || '',
                                    min_budget: proj.min_budget || '',
                                    mxn_budget: proj.mxn_budget || '',
                                    skills: proj.skills || [],
                                    fileattach: proj.fileattach || '',
                                    total_proposal: proj.total_proposal || '',
                                    createdAt: proj.createdAt,
                                    category_name: category?.name || "",
                                    category_image: category?.image || "",
                                    total_bid_count: totalBids,
                                    bid_status: latestBid?.status || "No Bids",
                                    application_status: latestApplicationStatus?.application_status || "No Bids",
                                    favorite_status: latestFavoriteStatus?.favorite_status || "0"
                               };
			   })
			);
			return res.status(200).json({
			    result: true,
			    msg: "Project list fetched successfully",
			    data: populatedJobs,
			});

	} catch (error) {
	     console.error("Error fetching job list:", error.message);
	      res.status(500).json({
		 result: false,
		  msg: "Something went wrong",
	         error: error.message,
	     });
	}
};

const freelancergetjobList = async (req, res) => {
	try {
		const { userId } = req.body;
                  if (!userId) {
                 return res.status(400).json({
                      result: false,
                      msg: "Parameter required: userId",
                 });
            }

		const jobs = await Job.find()
			.sort({ createdAt: -1 })
			.select(
				"userID catID job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal createdAt"
			).populate({
				path: "userID",
				select: "first_name last_name"  // Sirf ye do fields chahiye
			});

		if (!jobs || jobs.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No projects found",
			});
		}

		const populatedJobs = await Promise.all(
			jobs.map(async (proj) => {
				const user = await Auth.findById(proj.userID).select("block_status");

				if (!user || user.block_status === 1) return null;

				const category = await Cate_job.findById(proj.catID).select("name image");
				const totalBids = await Bid.countDocuments({ JobID: proj._id });
				const latestBid = await Bid.findOne({ JobID: proj._id }).sort({ _id: -1 });
                                const latestApplicationStatus = await Apply.findOne({ JobID: proj._id }).sort({ _id: -1 });
                                const latestFavoriteStatus = await Job_Favorite.findOne({ JobID: proj._id }).sort({ _id: -1 });
                                return {
					_id: proj._id || '',
                                        userID: proj.userID?._id || '',
                                        first_name: proj.userID?.first_name || '',
                                        last_name: proj.userID?.last_name || '',
                                        catID: proj.catID || '',
                                        job_title: proj.job_title,
                                        job_type: proj.job_type,
                                        job_description: proj.job_description,
                                        job_responsibilities: proj.job_responsibilities,
                                        work_location_type: proj.work_location_type,
                                        location: proj.location,
                                        min_salary: proj.min_salary,
                                        mxn_salary: proj.mxn_salary,
                                        education: proj.education,
                                        english: proj.english,
                                        experience: proj.experience,
                                        skills: proj.skills,
                                        total_proposal: proj.total_proposal,
                                        createdAt: proj.createdAt,
                                        category_name: category?.name || "",
                                        category_image: category?.image || "",
                                        total_bid_count: totalBids,
                                        bid_status: latestBid?.status || "No Bids",
                                        application_status: latestApplicationStatus?.application_status || "No Bids",
                                        favorite_status: latestFavoriteStatus?.favorite_status || "0"
                                };
			})
		);

		const filteredJobs = populatedJobs.filter(job => job !== null);

		if (filteredJobs.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No jobs found (some users may be blocked)",
			});
		}

		return res.status(200).json({
			result: true,
			msg: "Jobs list fetched successfully",
			data: filteredJobs,
		});

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};


const AllfreelancerbanneryFatch = async (req, res) => {
	try {
		const fatchbanner = await freelancerbanner.find().sort({ _id: -1 });

		if (!fatchbanner || fatchbanner.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No banner found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Freelancer Banner List",
			data: fatchbanner,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};

const FreelancerApplyjob = async (req, res) => {
	try {
		const { JobID, FreelancerID, cover_letter} = req.body;

		if (!JobID || !FreelancerID || !cover_letter) {
			return res.status(400).json({
				result: false,
				msg: "JobID, FreelancerID, cover_letter, fileattach_apply are required"
			});
		}

		const fileattach_apply = req.files ? req.files.map(file => file.filename).join(",") : null;

		const job = await Job.findById(JobID);
		if (!job) {
			return res.status(404).json({ result: false, msg: "Job not found" });
		}

		const newJobApply = new Apply({
			JobID,
			FreelancerID,
			cover_letter,
			fileattach_apply
		});
		await newJobApply.save();
		const updatedTotalProposal = (parseInt(job.total_proposal, 10) || 0) + 1;

		await Job.findByIdAndUpdate(JobID, { total_proposal: updatedTotalProposal.toString() }, { new: true });

		res.status(201).json({
			result: true,
			msg: "Job Applied Successfully",
			data: newJobApply
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Error applying job",
			error: error.message
		});
	}
};

const FreelancerApplyprojects = async (req, res) => {
	try {
		const { projectID, FreelancerID, cover_letter, rate} = req.body;

		if (!projectID || !FreelancerID || !rate) {
			return res.status(400).json({
				result: false,
				msg: "projectID, FreelancerID, cover_letter, rate, fileattach_apply are required"
			});
		}

		const fileattach_apply = req.files ? req.files.map(file => file.filename).join(",") : null;

		const projects = await Project.findById(projectID);
		if (!projects) {
			return res.status(404).json({ result: false, msg: "Project not found" });
		}

		const newprojectApply = new Apply_Project({
			projectID,
			FreelancerID,
			cover_letter,
			rate,
			fileattach_apply
		});
		await newprojectApply.save();
		const updatedTotalProposal = (parseInt(projects.total_proposal, 10) || 0) + 1;

		await Project.findByIdAndUpdate(projectID, { total_proposal: updatedTotalProposal.toString() }, { new: true });

		res.status(201).json({
			result: true,
			msg: "Project Applied Successfully",
			data: newprojectApply
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Error applying project",
			error: error.message
		});
	}
};

const freelancerjobaddtoFavorite = async (req, res) => {
	try {
			const { JobID, freelancerId } = req.body;

			if (!JobID || !freelancerId) {
					return res.status(400).json({
							result: false,
							msg: "JobID and freelancerId are required",
					});
			}

			if (!mongoose.Types.ObjectId.isValid(JobID) || !mongoose.Types.ObjectId.isValid(freelancerId)) {
					return res.status(400).json({
							result: false,
							msg: "Invalid JobID or freelancerId format",
					});
			}

			const job = await Job.findById(JobID);
			if (!job) {
					return res.status(404).json({
							result: false,
							msg: "Job not found",
					});
			}

			const user = await Auth.findById(freelancerId);
			if (!user) {
					return res.status(404).json({
							result: false,
							msg: "Freelancer not found",
					});
			}

			const existingFavorite = await Job_Favorite.findOne({ jobId: JobID, freelancerId });

			if (existingFavorite) {
					await Job_Favorite.findByIdAndDelete(existingFavorite._id);
					return res.status(200).json({
							result: true,
							msg: "Job removed from favorites",
							favorite_status: "0",
					});
			} else {
					const newFavorite = new Job_Favorite({ jobId: JobID, freelancerId });
					await newFavorite.save();

					return res.status(200).json({
							result: true,
							msg: "Job added to favorites",
							favorite_status: "1",
					});
			}
	} catch (error) {
			res.status(500).json({
					result: false,
					msg: "Error updating favorite status",
					error: error.message,
			});
	}
};


const freelancerprojectaddtoFavorite = async (req, res) => {
	try {
			const { projectID, freelancerId } = req.body;

			if (!projectID || !freelancerId) {
					return res.status(400).json({
							result: false,
							msg: "projectID and freelancerId are required",
					});
			}

			if (!mongoose.Types.ObjectId.isValid(projectID) || !mongoose.Types.ObjectId.isValid(freelancerId)) {
					return res.status(400).json({
							result: false,
							msg: "Invalid projectID or freelancerId format",
					});
			}

			const projects = await Project.findById(projectID);
			if (!projects) {
					return res.status(404).json({
							result: false,
							msg: "Project not found",
					});
			}

			const user = await Auth.findById(freelancerId);
			if (!user) {
					return res.status(404).json({
							result: false,
							msg: "Freelancer not found",
					});
			}

			const existingFavorite = await Project_Favorite.findOne({ projectID: projectID, freelancerId });

			if (existingFavorite) {
					await Project_Favorite.findByIdAndDelete(existingFavorite._id);
					return res.status(200).json({
							result: true,
							msg: "Project removed from favorites",
							favorite_status: "0",
					});
			} else {
					const newFavorite = new Project_Favorite({ projectID: projectID, freelancerId });
					await newFavorite.save();

					return res.status(200).json({
							result: true,
							msg: "Project added to favorites",
							favorite_status: "1",
					});
			}
	} catch (error) {
			res.status(500).json({
					result: false,
					msg: "Error updating favorite status",
					error: error.message,
			});
	}
};

const freelancerfoliosList = async (req, res) => {
			try {
					const { userId } = req.body;
		
					if (!userId) {
							return res.status(400).json({
									result: false,
									msg: "Parameter required: userId",
							});
					}
		
					const Fortfolio = await freeFourtFolio.find({ userId });
		
					if (!Fortfolio || Fortfolio.length === 0) {
							return res.status(404).json({
									result: false,
									msg: "Fortfolio not found",
							});
					}
		
					const updatedPortfolio = Fortfolio.map((item) => {
							let imageArray = [];
		
							if (item.image && typeof item.image === "string") {
									imageArray = item.image
											.split(",")
											.map((img) => img.trim())
											.filter(Boolean);
							} else if (Array.isArray(item.image)) {
									imageArray = item.image;
							}
		
							return {
									...item._doc, 
									image: imageArray,
							};
					});
		
					return res.status(200).json({
							result: true,
							msg: "Fortfolio fetched successfully",
							data: updatedPortfolio,
					});
			} catch (error) {
					res.status(500).json({
							result: false,
							msg: "Something went wrong",
							error: error.message,
					});
			}
		};

const FreelancerportfolioDelete = async (req, res) => {
		try {
				const { portfolioId } = req.body;

				if (!portfolioId) {
						return res.status(400).json({
								result: false,
								msg: "Parameter required: portfolioId",
						});
				}

				const fatchportfolio = await freeFourtFolio.findById(portfolioId);
				if (!fatchportfolio) {
						return res.status(404).json({
								result: false,
								msg: "Freelancer Portfolio Not Found!",
						});
				}

				await freeFourtFolio.findByIdAndDelete(portfolioId);

				res.status(200).json({
						result: true,
						msg: "Freelancer Portfolio Deleted Successfully",
				});

		} catch (error) {
				res.status(500).json({
						result: false,
						msg: "Error deleting company portfolio",
						error: error.message,
				});
		}
};


const freelancerongoingProject = async (req, res) => {
	try {
		const { FreelancerID } = req.body;

		if (!FreelancerID) {
			return res.status(400).json({
				result: "false",
				msg: "Parameter required: FreelancerID"
			});
		}

		const applications = await Apply_Project.find({
			FreelancerID: FreelancerID,
			application_status: "Active"
		})
			.populate({
				path: 'projectID',
				select: 'project_name project_description userID updatedAt',
				populate: {
					path: 'userID', 
					select: 'first_name last_name profile_image'
				}
			})

		if (!applications || applications.length === 0) {
			return res.status(404).json({
				result: "false",
				msg: "No ongoing projects found for this freelancer"
			});
		}

		const formattedData = applications.map(app => ({
			application_id: app._id,
			projectID: app.projectID?._id,
			project_name: app.projectID?.project_name || "",
			project_description: app.projectID?.project_description || "",
			rate: app.rate,
			cover_letter: app.cover_letter,
			application_status: app.application_status,
			fileattach_apply: app.fileattach_apply,
			updatedAt: app.updatedAt,

			FreelancerID: app.FreelancerID?._id,

			userID: app.projectID?.userID?._id || "",
			company_name: app.projectID?.userID?.company_name || app.projectID?.userID?.first_name + " " + app.projectID?.userID?.last_name || "",
   company_logo: app.projectID?.userID?.company_logo || app.projectID?.userID?.profile_image || ""

		}));

		return res.status(200).json({
			result: "true",
			msg: "Freelancer ongoing projects fetched successfully",
			data: formattedData
		});

	} catch (error) {
		console.error("Error fetching freelancer ongoing projects:", error);
		return res.status(500).json({
			result: "false",
			msg: "Something went wrong",
			error: error.message
		});
	}
};

const freelancerapplyprojectList = async (req, res) => {
	try {
		const { FreelancerID } = req.body;

		if (!FreelancerID) {
			return res.status(404).json({
				result: false,
				msg: "Required parameters: FreelancerID",
			});
		}

		const projects = await Apply_Project.find({FreelancerID:FreelancerID})
			.sort({ createdAt: -1 })
			.select(
				"_id projectID FreelancerID rate cover_letter application_status fileattach_apply createdAt"
			).populate({
				path: "FreelancerID",
				select: "first_name last_name"  // Sirf ye do fields chahiye
			}).populate({
                               path: "projectID",
                               select: "project_name project_description experience budget_type min_budget mxn_budget skills fileattach total_proposal favorite_status createdAt userID",
                               populate: {
                                  path: "userID",   // <-- nested populate
                                  select: "first_name last_name"
                              }
                        });

		if (!projects || projects.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No projects found",
			});
		}else{
                    const response = projects.map(p => ({
			_id: p._id,
			projectID: p.projectID?._id || '', // handle whichever exists
			rate: p.rate,
			cover_letter: p.cover_letter,
			application_status: p.application_status,
			fileattach_apply: p.fileattach_apply,
			createdAt: p.createdAt,
			first_name: p.projectID?.userID?.first_name || '',
                        last_name: p.projectID?.userID?.last_name || '',
                        project_name: p.projectID?.project_name || '',
                        project_description: p.projectID?.project_description || '',
                        experience: p.projectID?.experience || '',
                        budget_type: p.projectID?.budget_type || '',
                        min_budget: p.projectID?.min_budget || '',
                        mxn_budget: p.projectID?.mxn_budget || '',
                        skills: p.projectID?.skills || '',
                        fileattach: p.projectID?.fileattach || '',
                        total_proposal: p.projectID?.total_proposal || '',
                        favorite_status: p.projectID?.favorite_status || '',
                        project_createdAt: p.projectID?.createdAt || '',
		   }));
		    return res.status(200).json({
			    result: true,
			    msg: "apply projects list fetched successfully",
			    data: response,
		    });
		}

	} catch (error) {
		console.error("Error fetching project list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const freelancerapplyjobList = async (req, res) => {
	try {
		const { FreelancerID } = req.body;

		if (!FreelancerID) {
			return res.status(404).json({
				result: false,
				msg: "Required parameters: FreelancerID",
			});
		}

		const projects = await Apply.find({FreelancerID:FreelancerID})
			.sort({ createdAt: -1 })
			.select(
				"_id JobID FreelancerID cover_letter application_status fileattach_apply createdAt"
			).populate({
				path: "FreelancerID",
				select: "first_name last_name"  // Sirf ye do fields chahiye
			}).populate({
                                path: "JobID",
                                select: "job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal favorite_status createdAt userID",
                                populate: {
                                     path: "userID",   // <-- nested populate
                                     select: "first_name last_name"
                                }
                       });

		if (!projects || projects.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No jobs found",
			});
		}else{
                    const response = projects.map(p => ({
			_id: p._id,
			JobID: p.JobID?._id || '', // handle whichever exists
			cover_letter: p.cover_letter,
			application_status: p.application_status,
			fileattach_apply: p.fileattach_apply,
			createdAt: p.createdAt,
			first_name: p.JobID?.userID?.first_name || '',
                        last_name: p.JobID?.userID?.last_name || '',
                        job_title: p.JobID?.job_title || '',
                        job_type: p.JobID?.job_type || '',
			job_description: p.JobID?.job_description || '',
			job_responsibilities: p.JobID?.job_responsibilities || '',
			work_location_type: p.JobID?.work_location_type || '',
			location: p.JobID?.location || '',
			min_salary: p.JobID?.min_salary || '',
			mxn_salary: p.JobID?.mxn_salary || '',
			education: p.JobID?.education || '',
			english: p.JobID?.english || '',
			experience: p.JobID?.experience || '',
			skills: p.JobID?.skills || '',
			total_proposal: p.JobID?.total_proposal || '',
			favorite_status: p.JobID?.favorite_status || '',
			job_createdAt: p.JobID?.createdAt || '',
		}));
		    return res.status(200).json({
			    result: true,
			    msg: "apply jobs list fetched successfully",
			    data: response,
		    });
		}

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const freelancergetcategoryprojectList = async (req, res) => {
	try {
		const { userId,categoryId } = req.body;
        if (!userId || !categoryId) {
            return res.status(400).json({
                result: false,
                msg: "Parameter required: userId & categoryId",
            });
        }
		const projects = await Project.find({catID:categoryId})
			.sort({ createdAt: -1 })
			.select(
				"userID catID project_name project_description budget_type experience min_budget mxn_budget skills fileattach total_proposal createdAt"
			).populate({
				path: "userID",
				select: "first_name last_name"  // Sirf ye do fields chahiye
			});

		if (!projects || projects.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No projects found",
			});
		}

		const populatedJobs = await Promise.all(
			projects.map(async (proj) => {
				const user = await Auth.findById(proj.userID).select("block_status");

				if (!user || user.block_status === 1) return null;

				const category = await Cate_job.findById(proj.catID).select("name image");
				const totalBids = await Bid.countDocuments({ projectID: proj._id });
				const latestBid = await Bid.findOne({ projectID: proj._id }).sort({ _id: -1 });
                const latestApplicationStatus = await Apply_Project.findOne({ projectID: proj._id }).sort({ _id: -1 });
                const latestFavoriteStatus = await Project_Favorite.findOne({ projectID: proj._id }).sort({ _id: -1 });
				
				return {
                     _id: proj._id,
                    userID: proj.userID?._id || '',
                    first_name: proj.userID?.first_name || '',
                    last_name: proj.userID?.last_name || '',
                    catID: proj.catID || '',
                    project_name: proj.project_name || '',
                    project_description: proj.project_description || '',
                    experience: proj.experience || '',
                    budget_type: proj.budget_type || '',
                    min_budget: proj.min_budget || '',
                    mxn_budget: proj.mxn_budget || '',
                    skills: proj.skills || [],
                    fileattach: proj.fileattach || '',
                    total_proposal: proj.total_proposal || '',
                    createdAt: proj.createdAt,
                    category_name: category?.name || "",
                    category_image: category?.image || "",
                    total_bid_count: totalBids,
                    bid_status: latestBid?.status || "No Bids",
                    application_status: latestApplicationStatus?.application_status || "No Bids",
                    favorite_status: latestFavoriteStatus?.favorite_status || "0"
                };
			})
		);

		const filteredJobs = populatedJobs.filter(job => job !== null);

		if (filteredJobs.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No projects found (some users may be blocked)",
			});
		}

		return res.status(200).json({
			result: true,
			msg: "Project list fetched successfully",
			data: filteredJobs,
		});

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};


const freelancergetCategoryjobList = async (req, res) => {
	try {
		const { userId,categoryId } = req.body;
		if (!userId || !categoryId) {
            return res.status(400).json({
                result: false,
                msg: "Parameter required: userId & categoryId",
            });
        }

		const jobs = await Job.find({catID:categoryId})
			.sort({ createdAt: -1 })
			.select(
				"userID catID job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal createdAt"
			).populate({
				path: "userID",
				select: "first_name last_name"  // Sirf ye do fields chahiye
			});

		if (!jobs || jobs.length === 0) {
			return res.status(404).json({ 
				result: false,
				msg: "No projects found",
			});
		}

		const populatedJobs = await Promise.all(
			jobs.map(async (proj) => {
				const user = await Auth.findById(proj.userID).select("block_status");

				if (!user || user.block_status === 1) return null;

				const category = await Cate_job.findById(proj.catID).select("name image");
				const totalBids = await Bid.countDocuments({ JobID: proj._id });
				const latestBid = await Bid.findOne({ JobID: proj._id }).sort({ _id: -1 });
                const latestApplicationStatus = await Apply.findOne({ JobID: proj._id }).sort({ _id: -1 });
                const latestFavoriteStatus = await Job_Favorite.findOne({ jobId: proj._id }).sort({ _id: -1 });

				return {
					_id: proj._id || '',
                    userID: proj.userID?._id || '',
                    first_name: proj.userID?.first_name || '',
                    last_name: proj.userID?.last_name || '',
                    catID: proj.catID || '',
                    job_title: proj.job_title,
                    job_type: proj.job_type,
                    job_description: proj.job_description,
                    job_responsibilities: proj.job_responsibilities,
                    work_location_type: proj.work_location_type,
                    location: proj.location,
                    min_salary: proj.min_salary,
                    mxn_salary: proj.mxn_salary,
                    education: proj.education,
                    english: proj.english,
                    experience: proj.experience,
                    skills: proj.skills,
                    total_proposal: proj.total_proposal,
                    createdAt: proj.createdAt,
                    category_name: category?.name || "",
                    category_image: category?.image || "",
                    total_bid_count: totalBids,
                    bid_status: latestBid?.status || "No Bids",
                    application_status: latestApplicationStatus?.application_status || "No Bids",
                    favorite_status: latestFavoriteStatus?.favorite_status || "0"
                };
			})
		);

		const filteredJobs = populatedJobs.filter(job => job !== null);

		if (filteredJobs.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No jobs found (some users may be blocked)",
			});
		}

		return res.status(200).json({
			result: true,
			msg: "Jobs list fetched successfully",
			data: filteredJobs,
		});

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const addfreelancerTransaction = async (req, res) => {
	try {
		const { userId, title, ammount, type, transaction_status } = req.body;

		if (!userId || !title || !ammount || !type || !transaction_status) {
			return res.status(400).json({ result: false, msg: "userId, title, ammount, type(Credit,Debit), transaction_status are required" });
		}

		const userData = await Auth.findById({ _id:userId });

		if (!userData) {
			return res.status(404).json({
				result: false,
				msg: "userId not found",
			});
		}

		const newData = new Transaction_Report({
			userId, title, ammount, type, transaction_status
		});

		await newData.save();
                const WalletAmmount = userData.wallet_ammount || 0;
                let totalAmmount;

                if (type.toLowerCase() === "credit" && transaction_status.toLowerCase() === "success") { 
                     totalAmmount = WalletAmmount + ammount;
                } else if (type.toLowerCase() === "debit" && transaction_status.toLowerCase() === "success") {
                    if (WalletAmmount < ammount) {
                         return res.status(400).json({
                             result: false,
                             msg: "Insufficient wallet balance for debit"
                         });
                    }
                       totalAmmount = WalletAmmount - ammount;
                    } else {
                        return res.status(400).json({
                            result: false,
                             msg: "Invalid transaction type. Must be Credit or Debit"
                        });
                    }

                await Auth.findByIdAndUpdate(userId, { wallet_ammount: totalAmmount }, { new: true });
		return res.status(200).json({
			result: true,
			msg: "freelancer transaction report added successfully",
			data: newData
		});

	} catch (error) {
		return res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message
		});
	}
};


const getfreelancerTransaction = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(404).json({ 
				result: false,
				msg: "Required parameters: userId",
			});
		}

		const projects = await Transaction_Report.find({userId:userId})
			.sort({ createdAt: -1 })
			.select(
				"_id userId title ammount type transaction_status createdAt"
			).populate({
				path: "userId",
				select: "wallet_ammount"  // Sirf ye do fields chahiye
			});

		if (!projects || projects.length === 0) {
			return res.status(404).json({ 
				result: false,
				msg: "No jobs found",
			});
		}else{
			const response = projects.map(p => ({
			    _id: p._id,
			    userId: p.userId?._id || '', // handle whichever exists
                             title: p.title,
			    ammount: p.ammount,
			    type: p.type,
			    fileattach_apply: p.fileattach_apply,
			    transaction_status:p.transaction_status,
			    createdAt: p.createdAt,
			    wallet_ammount: p.userId?.wallet_ammount || 0,  
		    }));

		    return res.status(200).json({
			    result: true,
			    msg: "transaction report list fetched successfully",
			    data: response,
		    });
		}    

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const AllcategorymainPower = async (req, res) => {
	try {
		const fatchcate = await Power_Cat.find().sort({ _id: -1 });

		if (!fatchcate || fatchcate.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No Categories Main Power Found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Category List Main Power",
			data: fatchcate,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};


const SubcategoryListmainPower = async (req, res) => {
  try {
    const { power_category_id } = req.body;

    if (!power_category_id) {
      return res.status(400).json({
        result: false,
        msg: 'power_category_id is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(power_category_id)) {
      return res.status(400).json({
        result: false,
        msg: 'power_category_id must be a valid ObjectId',
      });
    }

    const subcategories = await Power_Cat_Sub
      .find({ power_category_id })
      .populate('power_category_id', 'name')
      .sort({ _id: -1 });

    if (subcategories.length === 0) {
      return res.status(404).json({
        result: false,
        msg: 'No Main Power Subcategories found',
        data: [],
      });
    }

    return res.status(200).json({
      result: true,
      msg: 'Main Power Subcategory list retrieved',
      data: subcategories,
    });

  } catch (error) {
    console.error('Error in listMainPowerSubcategories:', error);
    return res.status(500).json({
      result: false,
      msg: 'Server Error',
      error: error.message,
    });
  }
};

const getfreelancerHeadline = async (req, res) => {
	try {
		const fatchheadline = await FreelancerHeadline.find().sort({ _id: -1 });

		if (!fatchheadline || fatchheadline.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No freelancer headline found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Freelancer Headline List",
			data: fatchheadline,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};

const getfreelancerBenefit = async (req, res) => {
	try {
		const fatchBenefit = await FreelancerBenefit.find().sort({ _id: -1 });

		if (!fatchBenefit || fatchBenefit.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No freelancer Benefit found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Freelancer Benefit List",
			data: fatchBenefit,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};

const getfreelancerWork = async (req, res) => {
	try {
		const fatchWork = await FreelancerWork.find().sort({ _id: -1 });

		if (!fatchWork || fatchWork.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No freelancer Work found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Freelancer Work List",
			data: fatchWork,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};



module.exports = {
      addPortfoliofreelancer,
      freelancergetProfile,
      freelancerHeaderUpdate,
      freelancerDescriptionUpdate,
      freelancerresumeUpdate,
      freelancerskillsUpdate,
      freelancerupdateEducation,
      freelancerslanguageUpdate,
      freelancerupdateEmploymentHistory,
      getTermsconditionFreelancer,
      getprivacyFreelancer,
      getfaqFreelancer,
      freelancergetprojectList,
      freelancergetjobList,
      AllfreelancerbanneryFatch,
      FreelancerApplyjob,
      FreelancerApplyprojects,
      freelancerjobaddtoFavorite,
      freelancerprojectaddtoFavorite,
      freelancerfoliosList,
      FreelancerportfolioDelete,
      freelancerongoingProject,
      freelancerapplyprojectList,
      freelancerapplyjobList,
      freelancergetcategoryprojectList,
      freelancergetCategoryjobList,
      addfreelancerTransaction,
      getfreelancerTransaction,
      AllcategorymainPower,
      SubcategoryListmainPower,
      getfreelancerHeadline,
      getfreelancerBenefit,
      getfreelancerWork
  };
