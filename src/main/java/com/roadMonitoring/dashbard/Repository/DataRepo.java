package com.roadMonitoring.dashbard.Repository;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataRepo extends JpaRepository<Dataentity, String> {



}
