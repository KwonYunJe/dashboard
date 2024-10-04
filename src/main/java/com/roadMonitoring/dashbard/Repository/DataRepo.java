package com.roadMonitoring.dashbard.Repository;

import com.roadMonitoring.dashbard.Entity.Dataentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataRepo extends JpaRepository<Dataentity, String> {

    public List<Dataentity> findByType(String type);
    public String[] findByTypeLocal(String type, String local);
}

